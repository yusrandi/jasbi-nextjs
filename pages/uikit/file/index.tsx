import React, { SyntheticEvent, useRef } from 'react';

import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const FileDemo = () => {
    const toast = useRef<Toast>(null);

    const onUpload = () => {
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    };

    const invoiceUploadHandler = ({ files }: any) => {
        const [file] = files;
        console.log({ file });

        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
            uploadInvoice(e.target.result);
        };
        fileReader.readAsDataURL(file);
    };
    const uploadInvoice = async (invoiceFile: any) => {
        let formData = new FormData();
        formData.append('invoiceFile', invoiceFile);
        formData.append('hello', "hello");
        console.log({ formData });


        const response = await fetch(`/api/upload`,
            {
                method: 'POST',
                body: formData
            },
        );
    };




    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <FileUpload name="demo[]" url="/api/upload" multiple accept="image/*" maxFileSize={1000000} customUpload={true}
                        uploadHandler={invoiceUploadHandler} chooseLabel='Upload Image' />

                    <h5>Basic</h5>
                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
                </div>
            </div>
        </div>
    );
};

export default FileDemo;
