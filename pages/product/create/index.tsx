
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadUploadEvent } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { KategoriService } from '../../../services/kategori_service';
import { Kategori, Product } from 'prisma/prisma-client';
import { emptyProduct } from '..';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/router';

export default function TemplateDemo() {
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState<File>()
    const [kategoris, setKategoris] = useState([])
    const [product, setProduct] = useState<Product>(emptyProduct)
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter()


    useEffect(() => {
        KategoriService.getData().then((data) => {
            console.log({ data });
            setKategoris(data.responsedata)
        })
    }, []);


    const onTemplateSelect = (e: any) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        xhr: XMLHttpRequest;
        let _totalSize = 0;

        e.files.forEach((file: any) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file: any, callback: any) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        // const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{value} KB / 1 MB</span>
                    {/* <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar> */}
                </div>
            </div>
        );
    };

    const itemTemplate = (file: any, props: any) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    function ProductDialogFooter() {
        return (
            <div className='flex mt-3 '>
                <Button label="Cancel" icon="pi pi-times" text onClick={() => { }} />
                <Button label="Save" icon="pi pi-check" text onClick={handleSave} />
            </div>
        )
    };


    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        // let _product = { ...product };
        // _product[`${name}`] = val;

        setProduct({ ...product, price: val });
    };
    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        // let _product = { ...product };
        // _product['category'] = e.value;
        setProduct({ ...product, kategoriId: e.value });
    };

    const invoiceUploadHandler = ({ files }: any) => {
        const [file] = files;
        console.log({ file });

        setSelectedFile(file)
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });


        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
            // console.log(e.target.result);
        };
        fileReader.readAsDataURL(file);
    };

    async function handleSave() {
        console.log({ product });
        console.log({ selectedFile });
        setSubmitted(true)

        if (product.kategoriId === 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'please select at least one category', life: 3000 });
            return
        }
        if (!selectedFile) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'please select an image', life: 3000 });
            return
        }

        try {

            let formData = new FormData();
            formData.append('id', "0");
            formData.append('myImage', selectedFile);
            formData.append('imageName', selectedFile.name);
            formData.append('name', product.name);
            formData.append('kategoriId', product.kategoriId.toString());
            formData.append('price', product.price.toString());
            formData.append('stock', product.stock.toString());
            formData.append('unit', product.unit!);
            formData.append('description', product.description!);

            const response = await fetch(`/api/product`,
                {
                    method: 'POST',
                    body: formData
                },
            );
            console.log({ response });
            if (response.status === 200) {
                router.replace('/product')
            }


        } catch (error) {
            console.log({ error });

        }

    }

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card p-fluid">

                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid text-red-600">Name is required.</small>}
                        </div>


                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                {
                                    kategoris.map((item: Kategori, index) => (
                                        <div className="field-radiobutton col-6" key={index}>
                                            <RadioButton inputId={`category${index + 1}`} name={item.name} value={item.id} onChange={onCategoryChange}
                                                checked={product.kategoriId === item.id}
                                            />
                                            <label htmlFor={`category${index + 1}`}>{item.name}</label>
                                        </div>
                                    ))
                                }


                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="IDR" locale="id-ID" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Stock</label>
                                <InputNumber id="quantity" value={product.stock!} onChange={(e) => setProduct({ ...product, stock: e.value! })} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="name">Unit</label>
                            <InputText id="unit" value={product.unit!} onChange={(e) => setProduct({ ...product, unit: e.target.value })} required autoFocus />

                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description!} onChange={(e) => setProduct({ ...product, description: e.target.value })} required rows={3} cols={20} />
                        </div>


                    </div>
                </div>
            </div>



            {/* <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000}
                customUpload={true}
                uploadHandler={invoiceUploadHandler}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} /> */}


            <h5>Product picture</h5>
            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={invoiceUploadHandler} />

            <ProductDialogFooter />

        </div>
    )
}
