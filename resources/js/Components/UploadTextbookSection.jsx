import React, { useState } from 'react';
import axios from 'axios';

const UploadTextbookSection = () => {
    const [title, setTitle] = useState('');
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle PDF input
    const handleFileChange = (e) => {
        setPdf(e.target.files[0]);
    };

    // Combined Upload and Process Functionality
    const handleUploadAndProcess = async () => {
        if (!title || !pdf) {
            alert('Please enter a title and select a PDF file.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('pdf', pdf);

        try {
            setLoading(true);
            const response = await axios.post('/admin/upload-and-process-textbook', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Textbook uploaded and processing started successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error uploading and processing textbook:', error);
            alert('Failed to upload and process textbook.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Upload and Process Textbook</h2>

            {/* Title Input */}
            <div>
                <label>Textbook Title:</label>
                <input
                    type="text"
                    placeholder="Enter textbook title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ display: 'block', marginBottom: '10px', width: '100%' }}
                />
            </div>

            {/* PDF Input */}
            <div>
                <label>Upload PDF:</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
            </div>

            {/* Combined Upload and Process Button */}
            <div>
                <button
                    onClick={handleUploadAndProcess}
                    disabled={loading}
                    style={{
                        padding: '10px',
                        backgroundColor: loading ? '#aaa' : '#4CAF50',
                        color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Processing...' : 'Upload and Start Processing'}
                </button>
            </div>
        </div>
    );
};

export default UploadTextbookSection;
