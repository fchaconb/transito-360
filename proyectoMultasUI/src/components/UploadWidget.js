import { useEffect, useRef } from "react";

const UploadWidget = ({ onUpload }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        const loadScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        loadScript().then(() => {
            cloudinaryRef.current = window.cloudinary;
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: 'dvdag5roy',
                uploadPreset: 'fcb_pre'
            }, function(error, result) {
                if (!error && result && result.event === "success") {
                    onUpload(result.info.secure_url);
                }
            });
        }).catch(error => {
            console.error("Failed to load Cloudinary script", error);
        });
    }, [onUpload]);

    return (
        <button type="button" className="resolver-button" onClick={() => widgetRef.current && widgetRef.current.open()}>
            Subir Foto
        </button>
    );
};

export default UploadWidget;