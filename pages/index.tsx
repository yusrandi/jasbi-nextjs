/* eslint-disable @next/next/no-img-element */

import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '../types/types';
import { ChartData, ChartOptions } from 'chart.js';
import { NotifikasiService } from '../services/notifikasi_service';
import { Kategori, Notifikasi, Product, Status, Transaksi, User } from 'prisma/prisma-client';
import { Badge } from 'primereact/badge';
import { KategoriService } from '../services/kategori_service';
import { ProductService } from '../services/product_service';
import { TransaksiService } from '../services/transaksi_service';
import { UserService } from '../services/user_service';
import { Dialog } from 'primereact/dialog';

const lineData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [notifikasis, setNotifikasis] = useState<Notifikasi[]>([]);
    const [notifikasi, setNotifikasi] = useState<Notifikasi>();
    const [kategoris, setKategoris] = useState<Kategori[]>([]);
    const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
    const [users, setUsers] = useState<User[]>([]);


    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    useEffect(() => {
        NotifikasiService.getData().then((data) => {
            console.log({ data });
            setNotifikasis(data.responsedata)
        })
    }, []);
    useEffect(() => {
        KategoriService.getData().then((data) => {
            console.log({ data });
            setKategoris(data.responsedata)
        })
    }, []);
    useEffect(() => {
        ProductService.getData().then((data) => {
            console.log({ data });
            setProducts(data.responsedata)
        })
    }, []);

    useEffect(() => {
        TransaksiService.getData().then((data) => {
            console.log({ data });
            setTransaksis(data.responsedata)
        })
    }, []);
    useEffect(() => {
        UserService.getData().then((data) => {
            console.log({ data });
            setUsers(data.responsedata)
        })
    }, []);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const status = {
        "KERANJANG": "danger",
        "DIPESAN": "warning",
        "DITERIMA": "info",
        "DIPROSES": "warning",
        "DIKIRIM": "info",
        "SELESAI": "success"
    }

    const [showDialog, setShowDialog] = useState(false);
    const [urlImage, setUrlImage] = useState<string>("image");


    const openNew = (notif: Notifikasi) => {
        setShowDialog(true);
        setNotifikasi(notif);
        setUrlImage(notif.transaksi!.file!)
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Kategori</span>
                            <div className="text-900 font-medium text-xl">{kategoris.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{kategoris.length} kategoris </span>
                    <span className="text-500">since last visit</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Product</span>
                            <div className="text-900 font-medium text-xl">{products.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{products.length}+ </span>
                    <span className="text-500">since last week</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Transaction</span>
                            <div className="text-900 font-medium text-xl">{transaksis.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{transaksis.length} </span>
                    <span className="text-500">newly transaction</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Users</span>
                            <div className="text-900 font-medium text-xl">{users.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{users.length} </span>
                    <span className="text-500">responded</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Sales</h5>
                    <DataTable value={notifikasis} rows={20} paginator responsiveLayout="scroll">
                        {/* <Column header="Image" body={(data) => <img className="shadow-2" src={`/demo/images/product/${data.image}`} alt={data.image} width="50" />} /> */}
                        <Column field="status" header="View" sortable style={{ width: '15%' }} body={(rowData: Notifikasi) => rowData.status !== 'KERANJANG' && rowData.transaksi?.file! !== 'image' ? <Button icon="pi pi-eye" text onClick={() => openNew(rowData)} /> : null} />
                        <Column field="status" header="Status" sortable style={{ width: '15%' }} body={(rowData: Notifikasi) => <Badge value={rowData.status} severity={rowData.status === 'KERANJANG' ? 'danger' : rowData.status === 'DIPESAN' ? 'warning' : rowData.status === 'SELESAI' ? 'success' : 'info'}></Badge>} />
                        <Column field="datetime" header="Tanggal" sortable style={{ width: '15%' }} />
                        <Column field="product" header="Product" sortable style={{ width: '15%' }} body={(data: Notifikasi) => data.transaksi?.product?.name!} />
                        <Column field="total" header="Total" sortable style={{ width: '15%' }} body={(data: Notifikasi) => formatCurrency(data.transaksi?.product?.price! * data.transaksi?.qty!)} />
                        <Column field="customer" header="Customer" sortable style={{ width: '15%' }} body={(data: Notifikasi) => data.transaksi?.customer?.name} />
                        {/* <Column
                            header="View"
                            style={{ width: '15%' }}
                            body={() => (
                                <>
                                    <Button icon="pi pi-search" text />
                                </>
                            )}
                        /> */}
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>

            <Dialog visible={showDialog} style={{ width: '450px' }} modal onHide={() => { setShowDialog(false); setUrlImage("image") }}>
                <div className="flex align-items-center justify-content-center">
                    {/* <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} /> */}

                    <img src={`/transaksi/${urlImage}`} alt={'transaksi file'} className="" height="100%" width={'100%'} />

                </div>
            </Dialog>
        </div>
    );
};

export default Dashboard;
