import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Rect, Text } from "react-konva";
import { useForm } from "@inertiajs/react";
import useImage from "use-image";
import axios from "axios";
import "../../css/AdminPage.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ResponsiveStage from "@/Components/ResponsiveStage";

const AdminPage = ({ auth, pages: initialPages }) => {
    const { data, setData, reset } = useForm({
        buttons: [],
        current_audio: null,
        x: null,
        y: null,
    });

    const [textbooks, setTextbooks] = useState([]);
    const [pages, setPages] = useState(initialPages || []);
    const [selectedTextbook, setSelectedTextbook] = useState(null);
    const [pageId, setPageId] = useState(null);
    const [buttons, setButtons] = useState([]);
    const [isPlacing, setIsPlacing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [image] = useImage(
        pageId
            ? `/pages/${pages.find((p) => p.id === pageId)?.textbook_id}/${
                  pages.find((p) => p.id === pageId)?.image
              }`
            : null
    );
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const audioStreamRef = useRef(null);

    useEffect(() => {
        const fetchTextbooks = async () => {
            try {
                const response = await axios.get("/api/textbooks");
                setTextbooks(response.data);
            } catch (error) {
                console.error("Error fetching textbooks:", error);
            }
        };

        fetchTextbooks();
    }, []);

    useEffect(() => {
        if (!pageId) return;

        const fetchButtons = async () => {
            try {
                const response = await axios.get(`/api/buttons/${pageId}`);
                setButtons(response.data.buttons || []);
            } catch (error) {
                console.error("Error fetching buttons:", error);
            }
        };

        fetchButtons();
    }, [pageId]);
    useEffect(() => {
        if (pageId) {
            axios
                .get(`/api/buttons/${pageId}`)
                .then((response) => {
                    setButtons(response.data.buttons || []);
                })
                .catch((error) =>
                    console.error("Error fetching buttons:", error)
                );
        }
    }, [pageId]);

    const handleTextbookUploadAndProcess = async (e) => {
        e.preventDefault(); // Prevent default form behavior
        setIsProcessing(true); // Start processing indicator

        const formData = new FormData();
        formData.append("title", e.target.title.value);
        formData.append("pdf", e.target.pdf.files[0]);

        try {
            await axios.post("/admin/upload-and-process-textbook", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Textbook uploaded and processed successfully!");
            window.location.reload(); // Refresh to load new textbooks/pages
        } catch (error) {
            console.error("Error uploading and processing textbook:", error);
            alert(
                "Failed to upload and process textbook. Check console for details."
            );
        } finally {
            setIsProcessing(false); // Stop processing indicator
        }
    };

    const playAudio = (audioPath) => {
        if (!selectedTextbook || !audioPath) {
            console.error("Audio path or selected textbook is missing.");
            return;
        }

        // Ensure audioPath is just the filename
        const sanitizedAudioPath = audioPath.replace(/^.*[\\/]/, ""); // Remove any path parts if present
        const fullAudioPath = `/api/buttons/audio/${selectedTextbook}/${sanitizedAudioPath}`;

        console.log("Loading audio from:", fullAudioPath);

        const audio = new Audio(fullAudioPath);
        audio
            .play()
            .then(() => console.log("Playing audio:", fullAudioPath))
            .catch((error) => console.error("Error playing audio:", error));
    };

    const handleTextbookChange = (textbookId) => {
        setSelectedTextbook(textbookId);
        setPages([]);
        setPageId(null);

        // Fetch pages for the selected textbook
        axios
            .get(`/api/textbooks/${textbookId}/pages`)
            .then((response) => setPages(response.data))
            .catch((error) => console.error("Error fetching pages:", error));
    };

    const handlePageSelection = (e) => {
        const _pageId = e.target.value;
        if (_pageId) {
            setPageId(parseInt(_pageId, 10));
            reset();
        }
    };

    const handleStageClick = (e) => {
        if (!isPlacing) return;

        const pos = e.target.getStage().getPointerPosition();
        const stage = e.target.getStage();

        if (
            pos.x >= 0 &&
            pos.x <= stage.width() &&
            pos.y >= 0 &&
            pos.y <= stage.height()
        ) {
            setData({ ...data, x: pos.x, y: pos.y });
        } else {
            alert("Button must be placed within the page boundaries.");
        }

        setIsPlacing(false);
    };

    const startRecording = () => {
        setIsRecording(true);
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                audioStreamRef.current = stream;
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: "audio/webm;codecs=opus",
                });
                mediaRecorderRef.current = mediaRecorder;

                audioChunks.current = [];
                mediaRecorder.ondataavailable = (event) =>
                    audioChunks.current.push(event.data);

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, {
                        type: "audio/webm;codecs=opus",
                    });
                    setData({ ...data, current_audio: audioBlob });
                    setIsRecording(false); // Stop recording indicator
                };

                mediaRecorder.start();
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
                alert("Microphone access denied or unavailable.");
                setIsRecording(false);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }

        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
            audioStreamRef.current = null;
        }

        setIsRecording(false);
    };

    const saveButton = async () => {
        if (!data.x || !data.y || !data.current_audio) {
            alert("Ensure you have placed the button and recorded audio.");
            return;
        }

        const formData = new FormData();
        formData.append("page_id", pageId);
        formData.append("x", data.x);
        formData.append("y", data.y);
        formData.append(
            "audio",
            data.current_audio,
            `button_audio_${data.buttons.length}.webm`
        );

        try {
            await axios.post("/admin/save-button", formData);
            setButtons([
                ...buttons,
                {
                    x: data.x,
                    y: data.y,
                    audio: URL.createObjectURL(data.current_audio),
                },
            ]);
            reset();
            alert("Button saved successfully!");
        } catch (error) {
            console.error("Error saving button:", error);
            alert("Failed to save button. Check console for details.");
        }
    };
    const savePage = async () => {
        try {
            await axios.post("/admin/save-page", { page_id: pageId });
            alert("Page finalized successfully!");
        } catch (error) {
            console.error("Error saving page:", error);
            alert("Failed to finalize page.");
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="admin-page-container">
                <header className="admin-header">
                    <h1>Админ Панел</h1>
                </header>

                <div className="upload-section">
                    <h2>Създай Учебник от PDF</h2>
                    <form
                        onSubmit={handleTextbookUploadAndProcess}
                        className="upload-form"
                    >
                        <div>
                            <label>Заглавие</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Задай име на учебника"
                                required
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>PDF файл:</label>
                            <input
                                type="file"
                                name="pdf"
                                accept="application/pdf"
                                required
                                className="file-input"
                            />
                        </div>
                        <button type="submit" className="button upload-button">
                            качи и създай
                        </button>
                    </form>
                </div>

                <div className="selectors">
                    <div className="textbook-selector">
                        <h2>Избери Учебник за Работа</h2>
                        <select
                            onChange={(e) =>
                                handleTextbookChange(e.target.value)
                            }
                            value={selectedTextbook || ""}
                            className="dropdown"
                        >
                            <option value="">Избери Учебник...</option>
                            {textbooks.map((textbook) => (
                                <option key={textbook.id} value={textbook.id}>
                                    {textbook.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTextbook && (
                        <div className="page-selector-section">
                            <h2>Избери Страница</h2>
                            {isLoading ? (
                                <p>Зарежда...</p>
                            ) : (
                                <select
                                    onChange={handlePageSelection}
                                    value={pageId || ""}
                                    className="dropdown"
                                >
                                    <option value="">Избери Станица...</option>
                                    {pages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            Страница {page.page_number}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                </div>

                {pageId && (
                    <div className="page-editor-section">
                        <h2>Създай Аудио Бутони</h2>
                        <ResponsiveStage
                            imageSrc={`/pages/${
                                pages.find((p) => p.id === pageId)?.textbook_id
                            }/${pages.find((p) => p.id === pageId)?.image}`}
                            buttons={buttons} // Pass fetched buttons
                            onPlayAudio={playAudio} // Pass the playAudio function
                            onStageClick={handleStageClick}
                            selectedTextbook={selectedTextbook} // Pass selectedTextbook here
                        />

                        {/* Audio Player Section */}
                        {data.current_audio && (
                            <div className="audio-player-section">
                                <audio
                                    controls
                                    src={URL.createObjectURL(
                                        data.current_audio
                                    )}
                                />
                            </div>
                        )}

                        {/* Controls Section */}
                        <div className="controls">
                            <button
                                className="button start-recording"
                                onClick={() => setIsPlacing(true)}
                            >
                                Създай Бутон
                            </button>
                            {isPlacing && <p>Изберете координати за бутона</p>}

                            {data.x && data.y && (
                                <>
                                    <p>
                                        Координати: ({data.x.toFixed(0)},{" "}
                                        {data.y.toFixed(0)})
                                    </p>
                                    {isRecording ? (
                                        <p className="recording-indicator">
                                            Recording...
                                        </p>
                                    ) : (
                                        <button
                                            className="button start-recording"
                                            onClick={startRecording}
                                        >
                                            Старт на запис
                                        </button>
                                    )}
                                    <button
                                        className="button stop-recording"
                                        onClick={stopRecording}
                                    >
                                        Стоп на запис
                                    </button>
                                    <button
                                        className="button save-button"
                                        onClick={saveButton}
                                    >
                                        Запази бутон
                                    </button>
                                </>
                            )}

                            <button
                                className="button save-page"
                                onClick={savePage}
                            >
                                Запиши страницата
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default AdminPage;
