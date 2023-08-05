
import { useRouter } from 'next/router'
import { Kategori, Product } from 'prisma/prisma-client'
import React, { useEffect, useRef, useState } from 'react'
import { emptyProduct } from '../..'
import { ProductService } from '../../../../services/product_service'
import CustomLoading from '../../../../components/loading'
import { InputText } from 'primereact/inputtext'
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton'
import { Toast } from 'primereact/toast'
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadUploadEvent } from 'primereact/fileupload'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber'
import { classNames } from 'primereact/utils'
import { InputTextarea } from 'primereact/inputtextarea'

export const getStaticPaths = async (context: any) => {
    const res = await fetch(`https://api.jasbiapp.site/api/product`)
    const data = await res.json()

    const paths = data.responsedata.map((product: Product) => {
        return {
            params: { productId: product.id.toString() }
        }
    })

    return {
        paths, fallback: false
    }

}
export const getStaticProps = async (context: any) => {
    const id = context.params.productId

    const res = await fetch(`https://api.jasbiapp.site/api/product/${id}`)
    const data = await res.json()
    const product: Product = data.responsedata

    const resKategoris = await fetch(`https://api.jasbiapp.site/api/kategori`)
    const dataKategoris = await resKategoris.json()
    const kategoris: Kategori[] = dataKategoris.responsedata



    return {
        props: { product: product, kategoris: kategoris }
    }

}
export default function ProductUpdate({ product, kategoris }: { product: Product, kategoris: Kategori[] }) {

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState<File>()
    const [newProduct, setNewProduct] = useState<Product>(product)
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter()
    const toast = useRef<Toast>(null);


    const onTemplateSelect = (e: any) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
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

        setNewProduct({ ...newProduct, price: val });
    };
    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        // let _product = { ...product };
        // _product['category'] = e.value;
        setNewProduct({ ...newProduct, kategoriId: e.value });
    };

    const invoiceUploadHandler = ({ files }: any) => {
        const [file] = files;
        console.log({ file });

        setSelectedFile(file)

        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
            // console.log(e.target.result);
        };
        fileReader.readAsDataURL(file);
    };

    async function handleSave() {
        console.log({ newProduct });
        console.log({ selectedFile });
        setSubmitted(true)

        if (newProduct.kategoriId === 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'please select at least one category', life: 3000 });
            return
        }
        // if (!selectedFile) {
        //     toast.current?.show({ severity: 'error', summary: 'Error', detail: 'please select an image', life: 3000 });
        //     return
        // }

        try {

            let formData = new FormData();
            formData.append('id', product.id.toString()!);
            formData.append('myImage', selectedFile!);
            formData.append('imageName', selectedFile ? selectedFile!.name : product.image);
            formData.append('name', newProduct.name);
            formData.append('kategoriId', newProduct.kategoriId.toString());
            formData.append('price', newProduct.price.toString());
            formData.append('stock', newProduct.stock.toString());
            formData.append('unit', newProduct.unit!);
            formData.append('description', newProduct.description!);

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
        <div>Hello {product.name}
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card p-fluid">
                        <Toast ref={toast}></Toast>

                        {

                            product.image && <img src={`/products/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block" />

                        }

                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" defaultValue={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !newProduct.name })} />
                            {submitted && !newProduct.name && <small className="p-invalid text-red-600">Name is required.</small>}
                        </div>


                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                {
                                    kategoris.map((item: Kategori, index) => (
                                        <div className="field-radiobutton col-6" key={index}>
                                            <RadioButton inputId={`category${index + 1}`} name={item.name} value={item.id} onChange={onCategoryChange}
                                                checked={newProduct.kategoriId === item.id}
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
                                <InputNumber id="price" value={newProduct.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="IDR" locale="id-ID" />
                            </div>
                            <div className="field col">
                                <label htmlFor="quantity">Stock</label>
                                <InputNumber id="quantity" value={newProduct.stock!} onChange={(e) => setNewProduct({ ...newProduct, stock: e.value! })} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="name">Unit</label>
                            <InputText id="unit" defaultValue={newProduct.unit!} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} />

                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" defaultValue={newProduct.description!} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required rows={3} cols={20} />
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
            </div>
        </div>
    )
}
