/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Product } from 'prisma/prisma-client';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../services/product_service';

export const emptyProduct: Product = {
    id: 0,
    name: '',
    image: '',
    description: '',
    price: 0,
    kategoriId: 0,
    stock: 0,
    unit: null,
    createdAt: null,
    updatedAt: null,
    kategori: null
};
export default function ProductIndex() {


    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Product[]>>(null);

    const router = useRouter()

    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        ProductService.getData().then((data) => {
            console.log({ data });
            setProducts(data.responsedata)
            setLoading(false)
        })
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const openNew = () => {
        router.push('/product/create')
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };


            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Product) => {
        setProduct({ ...product });
        router.push(`/product/update/${product.id}`)
    };

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        try {

            await ProductService.deleteData(product).then((data) => {
                console.log({ data });
                if (data.responsecode === 1) {
                    setProducts(data.responsedata)
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });

                }

                setDeleteProductDialog(false);
                setProduct(emptyProduct);
                setLoading(false)


            })

        } catch (error) {
            console.log({ error });

        }


    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };


    const nameBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };
    const stockBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Stock</span>
                {rowData.stock} {rowData.unit}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/products/${rowData.image}`} alt={rowData.image} className="" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price) as unknown as number}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.kategori?.name}
            </>
        );
    };



    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as Product[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="name" header="Product Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="stock" header="Stock" sortable body={stockBodyTemplate}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

// export default ProductIndex;
