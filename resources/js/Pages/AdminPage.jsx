import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import { useForm } from '@inertiajs/react';
import useImage from 'use-image';
import axios from 'axios';
import '../../css/AdminPage.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ResponsiveStage from '@/Components/ResponsiveStage';

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
    const [isPlacing, setIsPlacing] = useState(false);
    const [image] = useImage(
        pageId
            ? `/pages/${pages.find((p) => p.id === pageId)?.textbook_id}/${pages.find((p) => p.id === pageId)?.image}`
            : null
    );
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const audioStreamRef = useRef(null);

    useEffect(() => {
        // Fetch all textbooks on load
        axios.get('/api/textbooks')
            .then((response) => setTextbooks(response.data))
            .catch((error) => console.error('Error fetching textbooks:', error));
    }, []);

    const handlePDFUpload = async (e) => {
        const formData = new FormData();
        formData.append('pdf', e.target.files[0]);

        try {
            await axios.post('/admin/upload-textbook', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('PDF uploaded and pages created successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Failed to upload PDF. Check console for details.');
        }
    };

    const handleTextbookChange = (textbookId) => {
        setSelectedTextbook(textbookId);
        setPages([]);
        setPageId(null);

        // Fetch pages for the selected textbook
        axios.get(`/api/textbooks/${textbookId}/pages`)
            .then((response) => setPages(response.data))
            .catch((error) => console.error('Error fetching pages:', error));
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
        setData({ ...data, x: pos.x, y: pos.y });
        setIsPlacing(false);
    };

    const startRecording = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                audioStreamRef.current = stream;
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
                mediaRecorderRef.current = mediaRecorder;

                audioChunks.current = [];
                mediaRecorder.ondataavailable = (event) => audioChunks.current.push(event.data);

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm;codecs=opus' });
                    setData({ ...data, current_audio: audioBlob });
                };

                mediaRecorder.start();
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
                alert('Microphone access denied or unavailable.');
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
    };

    const saveButton = async () => {
        if (!data.x || !data.y || !data.current_audio) {
            alert('Ensure you have placed the button and recorded audio.');
            return;
        }

        const formData = new FormData();
        formData.append('page_id', pageId);
        formData.append('x', data.x);
        formData.append('y', data.y);
        formData.append('audio', data.current_audio, `button_audio_${data.buttons.length}.webm`);

        try {
            await axios.post('/admin/save-button', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setData({
                ...data,
                buttons: [...data.buttons, { x: data.x, y: data.y }],
                current_audio: null,
                x: null,
                y: null,
            });
            alert('Button saved successfully!');
        } catch (error) {
            console.error('Error saving button:', error);
            alert('Failed to save button. Check console for details.');
        }
    };

    const savePage = async () => {
        try {
            await axios.post('/admin/save-page', { page_id: pageId });
            alert('Page finalized successfully!');
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Failed to finalize page.');
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="admin-page-container">
                <header className="admin-header">
                    <h1>Admin Page</h1>
                </header>

                <div className="upload-section">
                    <h2>Upload PDF</h2>
                    <input type="file" accept="application/pdf" onChange={handlePDFUpload} className="file-input" />
                </div>

                <div className="selectors">
                    <div className="textbook-selector">
                        <h2>Select Textbook</h2>
                        <select
                            onChange={(e) => handleTextbookChange(e.target.value)}
                            value={selectedTextbook || ''}
                            className="dropdown"
                        >
                            <option value="">Choose a textbook...</option>
                            {textbooks.map((textbook) => (
                                <option key={textbook.id} value={textbook.id}>
                                    {textbook.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedTextbook && (
                        <div className="page-selector-section">
                            <h2>Select Page</h2>
                            <select
                                onChange={handlePageSelection}
                                value={pageId || ''}
                                className="dropdown"
                            >
                                <option value="">Choose a page...</option>
                                {pages.map((page) => (
                                    <option key={page.id} value={page.id}>
                                        Page {page.page_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {pageId && (
    <div className="page-editor-section">
        <h2>Page Editor</h2>
        <ResponsiveStage
            imageSrc={
                pageId
                    ? `/pages/${pages.find((p) => p.id === pageId)?.textbook_id}/${pages.find((p) => p.id === pageId)?.image}`
                    : null
            }
            buttons={data.buttons}
            onStageClick={(e) => {
                if (!isPlacing) return;

                const pos = e.target.getStage().getRelativePointerPosition();
                setData({ ...data, x: pos.x, y: pos.y });
                setIsPlacing(false);
            }}
        />

        {/* Audio Player Section */}
        {data.current_audio && (
            <div className="audio-player-section">
                <audio controls src={URL.createObjectURL(data.current_audio)} />
            </div>
        )}

        {/* Controls Section */}
        <div className="controls">
            <button className="button start-recording" onClick={() => setIsPlacing(true)}>
                Create Button
            </button>
            {isPlacing && <p>Click on the page to place the button.</p>}

            {data.x && data.y && (
                <>
                    <p>
                        Button placed at ({data.x.toFixed(0)}, {data.y.toFixed(0)})
                    </p>
                    <button className="button start-recording" onClick={startRecording}>
                        Start Recording
                    </button>
                    <button className="button stop-recording" onClick={stopRecording}>
                        Stop Recording
                    </button>
                    <button className="button save-button" onClick={saveButton}>
                        Save Button
                    </button>
                </>
            )}
            <button className="button save-page" onClick={savePage}>
                Finalize Page
            </button>
        </div>
    </div>
)}

            </div>
        </AuthenticatedLayout>
    );
};

export default AdminPage;
