/* eslint-disable @next/next/no-img-element */

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
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../types/demo';
import { Status, Transaksi } from 'prisma/prisma-client';
import CustomLoading from '../../components/loading';
import { TransaksiService } from '../../services/transaksi_service';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';

const TransaksiIndex = () => {
    let emptyTransaksi: Transaksi = {
        id: 0,
        createdAt: null,
        updatedAt: null,
        datetime: '',
        transaksiCode: '',
        customerId: 0,
        productId: 0,
        qty: 0,
        total: 0,
        file: '',
        status: null,
        product: null,
        customer: null
    };

    const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
    const [transaksiDialog, setTransaksiDialog] = useState(false);
    const [deleteTransaksiDialog, setDeleteTransaksiDialog] = useState(false);
    const [deleteTransaksisDialog, setDeleteTransaksisDialog] = useState(false);
    const [transaksi, setTransaksi] = useState<Transaksi>(emptyTransaksi);
    const [selectedTransaksis, setSelectedTransaksis] = useState<Transaksi[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Transaksi[]>>(null);

    const [isLoading, setLoading] = useState<boolean>(true)
    const [statuses, setStatuses] = useState<Status[]>([Status.KERANJANG, Status.DIPESAN, Status.DITERIMA, Status.DIPROSES, Status.DIKIRIM, Status.SELESAI]);


    useEffect(() => {
        TransaksiService.getData().then((data) => {
            console.log({ data });
            setTransaksis(data.responsedata)
            setLoading(false)
        })
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };


    const openNew = () => {
        setTransaksi(emptyTransaksi);
        setSubmitted(false);
        setTransaksiDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTransaksiDialog(false);
    };

    const hideDeleteTransaksiDialog = () => {
        setDeleteTransaksiDialog(false);
    };

    const hideDeleteTransaksisDialog = () => {
        setDeleteTransaksisDialog(false);
    };

    const saveTransaksi = () => {
        setSubmitted(true);
        console.log({ transaksi });

        handleUpdate()

        // if (transaksi.name.trim()) {

        //     if (Transaksi.id === 0) {
        //         handleStore()
        //     } else {
        //         handleUpdate()
        //     }
        // }
    };

    async function handleStore() {
        try {
            // await TransaksiService.createData(Transaksi).then((data) => {
            //     console.log({ data });
            //     if (data.responsecode === 1) {
            //         setTransaksis(data.responsedata)

            //     }

            //     setTransaksiDialog(false);
            //     setTransaksi(emptyTransaksi);
            //     setLoading(false)

            //     toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Transaksi Created', life: 3000 });


            // })
        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpdate() {
        try {
            await TransaksiService.updateData(transaksi).then((data) => {
                console.log({ data });
                setTransaksis(data.responsedata)
                setLoading(false)
                setTransaksiDialog(false);
                setTransaksi(emptyTransaksi);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Status Updated', life: 3000 });


            })

        } catch (error) {
            console.log(error);
        }
    }

    const editTransaksi = (transaksi: Transaksi) => {
        setTransaksi({ ...transaksi });
        setTransaksiDialog(true);
    };

    const confirmDeleteTransaksi = (transaksi: Transaksi) => {
        setTransaksi(transaksi);
        setDeleteTransaksiDialog(true);
    };

    const deleteTransaksi = async () => {
        // let _Transaksis = Transaksis.filter((val) => val.id !== Transaksi.id);
        // setTransaksis(transaksis);
        try {

            await TransaksiService.deleteData(transaksi).then((data) => {
                console.log({ data });
                if (data.responsecode === 1) {
                    setTransaksis(data.responsedata)

                    setDeleteTransaksiDialog(false);
                    setTransaksi(emptyTransaksi);
                    setLoading(false)

                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Transaksi Deleted', life: 3000 });


                }


            })

        } catch (error) {
            console.log({ error });

        }
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteTransaksisDialog(true);
    };

    const deleteSelectedTransaksis = () => {
        // let _Transaksis = Transaksis.filter((val) => !selectedTransaksis?.includes(val));
        // setTransaksis(_Transaksis);
        setDeleteTransaksisDialog(false);
        setSelectedTransaksis([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Transaksis Deleted', life: 3000 });
    };

    const onInputNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _transaksi = { ...transaksi };
        // _transaksi.name = val;

        // setTransaksi(_Transaksi);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTransaksis || !selectedTransaksis.length} />
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


    const nameBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">Tanggal</span>
                {rowData.datetime}
            </>
        );
    };
    const codeBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.transaksiCode}
            </>
        );
    };
    const productBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">product</span>
                {rowData.product?.name}
            </>
        );
    };
    const productPriceBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">product price</span>
                {formatCurrency(rowData.product?.price as unknown as number)}
            </>
        );
    };
    const qtyBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">qty</span>
                {rowData.qty}
            </>
        );
    };
    const totalBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">total</span>
                {formatCurrency(rowData.product?.price! * rowData.qty)}
            </>
        );
    };
    const customerBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                <span className="p-column-title">customer</span>
                {rowData.customer?.name}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Transaksi) => {

        return (
            <>
                <span className="p-column-title">status</span>
                <Badge value={rowData.status} severity={rowData.status === 'KERANJANG' ? 'danger' : rowData.status === 'DIPESAN' ? 'warning' : rowData.status === 'SELESAI' ? 'success' : 'info'}></Badge>

            </>
        );
    };



    const actionBodyTemplate = (rowData: Transaksi) => {
        return (
            <>
                {rowData.status !== 'SELESAI' ?
                    <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editTransaksi(rowData)} />
                    : null
                }
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteTransaksi(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Transaksis</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const TransaksiDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveTransaksi} />
        </>
    );
    const deleteTransaksiDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteTransaksiDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteTransaksi} />
        </>
    );
    const deleteTransaksisDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteTransaksisDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedTransaksis} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    {
                        isLoading ? <CustomLoading /> :
                            <DataTable
                                ref={dt}
                                value={transaksis}
                                selection={selectedTransaksis}
                                onSelectionChange={(e) => setSelectedTransaksis(e.value as Transaksi[])}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Transaksis"
                                globalFilter={globalFilter}
                                emptyMessage="No Transaksis found."
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column field="datetime" header="Tanggal" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="code" header="Kode Transaksi" sortable body={codeBodyTemplate}></Column>
                                <Column field="productId" header="Produk" sortable body={productBodyTemplate}></Column>
                                <Column field="product price" header="price" sortable body={productPriceBodyTemplate}></Column>
                                <Column field="qty" header="qty" sortable body={qtyBodyTemplate}></Column>
                                <Column field="total" header="total" sortable body={totalBodyTemplate}></Column>
                                <Column field="customer" header="Customer" sortable body={customerBodyTemplate}></Column>
                                <Column field="status" header="Status Transaksi" sortable body={statusBodyTemplate}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                    }

                    <Dialog visible={transaksiDialog} style={{ width: '450px' }} header="Transaksi Details" modal className="p-fluid" footer={TransaksiDialogFooter} onHide={hideDialog}>
                        {/* <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={Transaksi.name} onChange={(e) => onInputNameChange(e)} required autoFocus className={classNames({ 'p-invalid': submitted && !Transaksi.name })} />
                            {submitted && !Transaksi.name && <small className="p-invalid">Name is required.</small>}
                        </div> */}

                        <div className="field">
                            <label htmlFor="dropdown">Hak Akses</label>
                            <Dropdown id="dropdown" options={statuses} value={transaksi.status} onChange={(e) => setTransaksi({ ...transaksi, status: e.target.value })} className="" />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteTransaksiDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransaksiDialogFooter} onHide={hideDeleteTransaksiDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {transaksi && (
                                <span>
                                    Are you sure you want to delete <b>{transaksi.transaksiCode}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTransaksisDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransaksisDialogFooter} onHide={hideDeleteTransaksisDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {transaksi && <span>Are you sure you want to delete the selected Transaksis?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TransaksiIndex;
