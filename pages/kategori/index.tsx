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
import { Kategori } from 'prisma/prisma-client';
import { KategoriService } from '../../services/kategori_service';
import CustomLoading from '../../components/loading';

const KategoriIndex = () => {
    let emptyKategori: Kategori = {
        id: 0,
        name: '',
        createdAt: null,
        updatedAt: null
    };

    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [kategoriDialog, setKategoriDialog] = useState(false);
    const [deleteKategoriDialog, setDeleteKategoriDialog] = useState(false);
    const [deleteKategorisDialog, setDeleteKategorisDialog] = useState(false);
    const [kategori, setKategori] = useState<Kategori>(emptyKategori);
    const [selectedKategoris, setSelectedKategoris] = useState<Kategori[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Kategori[]>>(null);

    const [isLoading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        KategoriService.getData().then((data) => {
            console.log({ data });
            setKategoris(data.responsedata)
            setLoading(false)
        })
    }, []);


    const openNew = () => {
        setKategori(emptyKategori);
        setSubmitted(false);
        setKategoriDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setKategoriDialog(false);
    };

    const hideDeleteKategoriDialog = () => {
        setDeleteKategoriDialog(false);
    };

    const hideDeleteKategorisDialog = () => {
        setDeleteKategorisDialog(false);
    };

    const saveKategori = () => {
        setSubmitted(true);
        console.log({ kategori });


        if (kategori.name.trim()) {

            if (kategori.id === 0) {
                handleStore()
            } else {
                handleUpdate()
            }
        }
    };

    async function handleStore() {
        try {
            await KategoriService.createData(kategori).then((data) => {
                console.log({ data });
                if (data.responsecode === 1) {
                    setKategoris(data.responsedata)

                }

                setKategoriDialog(false);
                setKategori(emptyKategori);
                setLoading(false)

                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Kategori Created', life: 3000 });


            })
        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpdate() {
        try {
            await KategoriService.updateData(kategori).then((data) => {
                console.log({ data });
                setKategoris(data.responsedata)
                setLoading(false)
                setKategoriDialog(false);
                setKategori(emptyKategori);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Kategori Updated', life: 3000 });


            })

        } catch (error) {
            console.log(error);
        }
    }

    const editKategori = (kategori: Kategori) => {
        setKategori({ ...kategori });
        setKategoriDialog(true);
    };

    const confirmDeleteKategori = (kategori: Kategori) => {
        setKategori(kategori);
        setDeleteKategoriDialog(true);
    };

    const deleteKategori = async () => {
        // let _kategoris = kategoris.filter((val) => val.id !== Kategori.id);
        // setKategoris(_Kategoris);
        try {

            await KategoriService.deleteData(kategori).then((data) => {
                console.log({ data });
                if (data.responsecode === 1) {
                    setKategoris(data.responsedata)

                }

                setDeleteKategoriDialog(false);
                setKategori(emptyKategori);
                setLoading(false)

                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Kategori Deleted', life: 3000 });

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
        setDeleteKategorisDialog(true);
    };

    const deleteSelectedKategoris = () => {
        // let _kategoris = kategoris.filter((val) => !selectedKategoris?.includes(val));
        // setKategoris(_Kategoris);
        setDeleteKategorisDialog(false);
        setSelectedKategoris([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Kategoris Deleted', life: 3000 });
    };

    const onInputNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _kategori = { ...kategori };
        _kategori.name = val;

        setKategori(_kategori);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedKategoris || !selectedKategoris.length} />
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


    const nameBodyTemplate = (rowData: Kategori) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };



    const actionBodyTemplate = (rowData: Kategori) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editKategori(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteKategori(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Kategoris</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const KategoriDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveKategori} />
        </>
    );
    const deleteKategoriDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteKategoriDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteKategori} />
        </>
    );
    const deleteKategorisDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteKategorisDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedKategoris} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {
                        isLoading ? <CustomLoading /> :
                            <DataTable
                                ref={dt}
                                value={kategoris}
                                selection={selectedKategoris}
                                onSelectionChange={(e) => setSelectedKategoris(e.value as Kategori[])}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Kategoris"
                                globalFilter={globalFilter}
                                emptyMessage="No Kategoris found."
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                    }

                    <Dialog visible={kategoriDialog} style={{ width: '450px' }} header="Kategori Details" modal className="p-fluid" footer={KategoriDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={kategori.name} onChange={(e) => onInputNameChange(e)} required autoFocus className={classNames({ 'p-invalid': submitted && !kategori.name })} />
                            {submitted && !kategori.name && <small className="p-invalid">Name is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteKategoriDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKategoriDialogFooter} onHide={hideDeleteKategoriDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {kategori && (
                                <span>
                                    Are you sure you want to delete <b>{kategori.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteKategorisDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteKategorisDialogFooter} onHide={hideDeleteKategorisDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {kategori && <span>Are you sure you want to delete the selected Kategoris?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default KategoriIndex;
