import {useEffect, useRef, useState} from "react";
import data from '../json/tsconfig.json';
import Chart from "chart.js/auto";
import {Bar} from "react-chartjs-2";


function Dashboard() {
    const [paymentMethodInfo, setPaymentMethodInfo] = useState({});
    const [topProductSalesLst, setTopProductSalesLst] = useState([]);
    const [salesDayLst, setSalesDayLst] = useState([]);
    const [customerSalesLst, setCustomerSalesLst] = useState([]);
    const [rateCustomerInfo, setRateCustomerInfo] = useState({});
    const [customerNewLst, setCustomerNewLst] = useState([]);
    const chartRef = useRef(null);
    useEffect(() => {
        setPaymentMethodInfo(data.PaymentMethodInfo);
        setTopProductSalesLst(data.TopProductSalesLst);
        setSalesDayLst(data.SalesDayLst);
        setCustomerSalesLst(data.CustomerSalesLst);
        setRateCustomerInfo(data.RateCustomerInfo);
        setCustomerNewLst(data.CustomerNewLst);
        console.log(data)
    }, [data]);

    const chartData = {
        labels: salesDayLst.map(day => day.Day),
        datasets: [
            {
                label: 'Sáng',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: salesDayLst.map(day => day.AM),
            },
            {
                label: 'Tối',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: salesDayLst.map(day => day.PM),
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    const sortedTopProducts = [...topProductSalesLst].sort((a, b) => b.Amount - a.Amount);
    const top5Products = sortedTopProducts.slice(0, 5);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const getCustomersByEmployee = (employeeCode, month, year) => {
        const filteredCustomers = data.CustomerSalesLst.filter(customer => {
            const customerDate = new Date(customer.Day);
            return (
                customerDate.getMonth() + 1 === month &&
                customerDate.getFullYear() === year
            );
        });

        return filteredCustomers;
    };

    return (
        <>
            <div className="row">
                <div className='col-4'>
                    <h2>Thống Kê</h2>
                </div>
                <div className='col-8'>
                    <table>
                        <tr>
                            <td>Từ ngày: <input type="date"/></td>
                            <td>Đến ngày: <input type="date"/></td>
                            <td>
                                <button
                                    style={{
                                        height: "45px",
                                        borderRadius: "5px",
                                        width: "100px",
                                        backgroundColor: "greenyellow",
                                        fontSize: "20px",
                                        color: "black"
                                    }}>Tra Cứu
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div className='row'>
                <div className='col-8'>
                    <div className="row">
                        <div className="col-3">
                            <div style={{border: '1px solid red', padding: '10px'}}>Tiền mặt
                                <div>{data.PaymentMethodInfo.Cash}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div style={{border: '1px solid red', padding: '10px'}}>Thẻ
                                <div>{data.PaymentMethodInfo.Card}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div style={{border: '1px solid red', padding: '10px'}}>Chuyển khoản
                                <div>{data.PaymentMethodInfo.CK}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div style={{border: '1px solid red', padding: '10px'}}>VN Pay
                                <div>{data.PaymentMethodInfo.VNPay}</div>
                            </div>
                        </div>

                        <h2 style={{marginLeft: '15px'}}>Doanh số bán hàng theo ca </h2>
                        <div className="col-md-12">
                            <div className="col-md-12">
                                <div className="card" style={{borderColor: 'red'}}>
                                    <Bar ref={chartRef} data={chartData} options={chartOptions}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <h4 style={{marginLeft: '15px'}}> Top 10 Khách hàng mua nhiều nhất</h4>
                            <div className="card" style={{borderColor: 'red'}}>
                                <table>
                                    <thead>
                                    <tr style={{textAlign: 'center'}}>
                                        <th>STT</th>
                                        <th>Tên khách hàng</th>
                                        <th>SDT</th>
                                        <th>Số đơn hàng</th>
                                        <th>Tổng tiền (VND)</th>
                                        <th>Tổng điểm</th>
                                    </tr>
                                    </thead>
                                    <tbody style={{textAlign: 'center'}}>
                                    {customerSalesLst.slice(0, 10).map((customer, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{customer.CustomerName}</td>
                                            <td>{customer.CustomerContact}</td>
                                            <td>{customer.QuantityBill}</td>
                                            <td>{customer.Amount}</td>
                                            <td>{customer.Point}</td>

                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-4'>
                    <div className='col-12'>
                        <div className="card" style={{borderColor: 'red'}}>
                            <h4>Top 5 sản phẩm doanh số cao</h4>
                            <hr style={{margin: '20px'}}/>
                            <ul>
                                {top5Products.map((product, index) => (
                                    <li key={index}>
                                        <strong>{index + 1}. {product.ProductName}</strong>
                                        <p> Doanh số: {product.Amount}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className="card" style={{ borderColor: 'red' }}>
                            <div className='row'>
                                <div className='col-8'>
                                    <h4>Khách hàng theo nhân viên</h4>
                                </div>
                                <div className='col-4'>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    >
                                        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    >
                                        {Array.from({ length: 5 }, (_, index) => 2023 - index).map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <hr style={{ margin: '20px' }} />
                            <ul>
                                {data.CustomerNewLst.map(customer => {
                                    const customersByEmployee = getCustomersByEmployee(customer.EmployeeCode, selectedMonth, selectedYear);
                                    if (customersByEmployee.length > 0) {
                                        return (
                                            <li key={customer.EmployeeCode}>
                                                <strong>{customer.EmployeeName}</strong> ({customersByEmployee.length} khách hàng)
                                                <ul>
                                                    {customersByEmployee.map((cus, index) => (
                                                        <li key={index}>
                                                            <div>
                                                                <strong>Tên khách hàng:</strong> {cus.CustomerName}
                                                            </div>
                                                            <div>
                                                                <strong>Số điện thoại:</strong> {cus.CustomerContact}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;