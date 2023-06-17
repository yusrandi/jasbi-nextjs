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
import { User } from 'prisma/prisma-client';
import { UserService } from '../../services/user_service';
import CustomLoading from '../../components/loading';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';

const UserIndex = () => {
    let emptyUser: User = {
        id: 0,
        name: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        role: 'ADMIN',
        createdAt: null,
        updatedAt: null
    };

    const [users, setUsers] = useState<User[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<User[]>>(null);
    const [newPassword, setNewPassword] = useState<string>('')

    const [isLoading, setLoading] = useState<boolean>(true)

    const roles = [
        'ADMIN',
        'MITRA',
        'USER',
    ];


    useEffect(() => {
        UserService.getData().then((data) => {
            console.log({ data });
            setUsers(data.responsedata)
            setLoading(false)
        })
    }, []);


    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);
        console.log({ user });


        if (user.name.trim() && user.address.trim() && user.phone.trim() && user.email.trim()) {

            if (user.id === 0) {
                handleStore()
            } else {
                handleUpdate()
            }
        }
    };

    async function handleStore() {
        try {
            await UserService.createData(user, newPassword).then((data) => {
                console.log({ data });
                if (data.responsecode === 1) {
                    setUsers(data.responsedata)

                    setUserDialog(false);
                    setUser(emptyUser);
                    setLoading(false)

                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'user Created', life: 3000 });

                } else {
                    toast.current?.show({ severity: 'error', summary: 'Failed', detail: data.responsemsg, life: 3000 });

                }




            })
        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpdate() {
        try {
            await UserService.updateData(user, newPassword).then((data) => {
                console.log({ data });
                setUsers(data.responsedata)
                setLoading(false)
                setUserDialog(false);
                setUser(emptyUser);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'user Updated', life: 3000 });


            })

        } catch (error) {
            console.log(error);
        }
    }

    const editUser = (user: User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = async () => {
        // let _Users = Users.filter((val) => val.id !== user.id);
        // setUsers(_Users);
        try {

            await UserService.deleteData(user).then((data) => {
                console.log({ data });
                if (data.responsecode === 1) {
                    setUsers(data.responsedata)

                }

                setDeleteUserDialog(false);
                setUser(emptyUser);
                setLoading(false)

                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'user Deleted', life: 3000 });

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
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        // let _Users = Users.filter((val) => !selectedUsers?.includes(val));
        // setUsers(_Users);
        setDeleteUsersDialog(false);
        setSelectedUsers([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    };

    const onInputNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _User = { ...user };
        _User.name = val;

        setUser(_User);
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
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


    const nameBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };
    const emailBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };
    const phoneBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };
    const addressBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className="p-column-title">Address</span>
                {rowData.address}
            </>
        );
    };
    const roleBodyTemplate = (rowData: User) => {
        const status = {
            "ADMIN": "OUTOFSTOCK",
            "MITRA": "LOWSTOCK",
            "USER": "INSTOCK"
        }
        return (
            <>
                <span className="p-column-title">Role</span>
                <span className={`product-badge status-${status[rowData.role!].toLowerCase()}`}>{rowData.role}</span>

                {/* {rowData.role} */}
            </>
        );
    };
    const tesRoleBodyTemplate = (rowData: User) => {
        const status = {
            "ADMIN": "OUTOFSTOCK",
            "MITRA": "LOWSTOCK",
            "USER": "INSTOCK"
        }
        return (
            <>
                <div className="field">
                    <label htmlFor="dropdown">Hak Akses</label>
                    <Dropdown id="dropdown" options={roles} value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} className="p-invalid" />
                </div>

                {/* {rowData.role} */}
            </>
        );
    };



    const actionBodyTemplate = (rowData: User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const UserDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedUsers} />
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
                                value={users}
                                selection={selectedUsers}
                                onSelectionChange={(e) => setSelectedUsers(e.value as User[])}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                                globalFilter={globalFilter}
                                emptyMessage="No Users found."
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="name" header="FullName" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="email" header="Email" body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="phone" header="Phone" body={phoneBodyTemplate}></Column>
                                <Column field="address" header="Address" body={addressBodyTemplate}></Column>
                                <Column field="role" header="Role" sortable body={roleBodyTemplate}></Column>
                                {/* <Column field="role" header="Role" sortable body={tesRoleBodyTemplate}></Column> */}
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                    }

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="user Details" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} placeholder='fullname' />
                            {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label >Address</label>
                            <InputText value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !user.address })} placeholder='Address' />
                            {submitted && !user.address && <small className="p-invalid">Address is required.</small>}
                        </div>
                        <div className="field">
                            <label >Phone Number</label>
                            <InputText value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !user.phone })} placeholder='0852******' />
                            {submitted && !user.phone && <small className="p-invalid">Phone is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="dropdown">Hak Akses</label>
                            <Dropdown id="dropdown" options={roles} value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} className="" />
                        </div>

                        <div className="field">
                            <label >Email</label>
                            <InputText value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} placeholder='use@use.use' />
                            {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <Password inputId="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="" placeholder='*******' />
                        </div>

                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Are you sure you want to delete <b>{user.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected Users?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserIndex;
