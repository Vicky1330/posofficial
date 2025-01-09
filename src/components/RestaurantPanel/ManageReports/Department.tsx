import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DatePicker from "react-datepicker";
import EmailModal from "./EmailModal";
import html2pdf from "html2pdf.js";

interface SalesData {
  Id: number;
  Name: string;
  TotalQuantity: number;
  TotalSale_Amount: number;
  TotalSale_Percentage: number;
}

interface ReportData {
  filterValue: string;
  filterValue2: string;
  totalQuantity: number;
  totalSaleAmount: number;
  totalSaleAmount_StringFormat: string;
  totalSalePercentage: number;
  totalSalePercentage_StringFormat: string;
  salesData_MainDepartment: SalesData[];
}
interface ReportDeptData {
  filterValue: string;
  filterValue2: string;
  totalQuantity: number;
  totalSaleAmount: number;
  totalSaleAmount_StringFormat: string;
  totalSalePercentage: number;
  totalSalePercentage_StringFormat: string;
  salesData_SubDepartment: SalesData[];
}

interface Department {
  restaurantLoginId: string;
  userToken: string;
}

const Department: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("master_department");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [flag, setFlag] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(1);
  const [chartOptions, setChartOptions] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});
  const [dateModal, setDateModal] = useState<boolean>(false);

  const [reportData, setReportData] = useState<ReportData>({
    filterValue: "",
    filterValue2: "",
    totalQuantity: 0,
    totalSaleAmount: 0,
    totalSaleAmount_StringFormat: "0.00",
    totalSalePercentage: 0,
    totalSalePercentage_StringFormat: "0.00",
    salesData_MainDepartment: [],
  });
  const [reportDepData, setReportDepData] = useState<ReportDeptData>({
    filterValue: "",
    filterValue2: "",
    totalQuantity: 0,
    totalSaleAmount: 0,
    totalSaleAmount_StringFormat: "0.00",
    totalSalePercentage: 0,
    totalSalePercentage_StringFormat: "0.00",
    salesData_SubDepartment: [],
  });

  const UserToken_Global = localStorage.getItem("authToken");
  const restaurantLoginId = 0;

  const handleDateModal = () => {
    setDateModal(true);
  };

  const handleCloseModal = () => {
    setStartDate(null);
    setEndDate(null);
    setDateModal(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {}, []);

  const handleEmailModalOpen = () => {
    const emailButton = document.getElementById(
      "btn_SendPDFReportEmail_RestaurantReports_Modal"
    ) as HTMLButtonElement;
    if (emailButton) {
      emailButton.click();
    }
  };

  // Function to handle filter type change
  const handleFilterTypeChange = (type: number) => {
    setFilterType(type);
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-US", options)
      .format(date)
      .replace(", ", " ");
  };

  const getGraphData = async (_val_FilterationType: string | number) => {
    setLoading(true);
    const fromDate = startDate ? formatDate(startDate) : "";
    const toDate = endDate ? formatDate(endDate) : "";
    const params = {
      restaurantLoginId,
      filterationType: _val_FilterationType,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }api/restaurant/reports/graph/maindepartment`,
        params,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === 1) {
        const data = response.data.data;
        const graphData = data.salesData_MainDepartment || [];

        const chartData = graphData.map((item: SalesData) => ({
          name: item.Name,
          y: item.TotalSale_Percentage,
        }));

        // setGraphData(chartData);
        setReportData(response.data.data);

        const options = {
          chart: {
            type: "pie",
            backgroundColor: "#00afff00",
          },
          title: {
            text: data.salesData_MainDepartment.length > 0 ? "" : "No Data",
            verticalAlign: "middle",
            floating: true,
          },
          tooltip: {
            pointFormat: "{point.name}: <b>{point.y}%</b>",
          },
          plotOptions: {
            pie: {
              size: 250,
              innerSize: "60%",
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
            },
          },
          series: [
            {
              name: "Main Department",
              colorByPoint: true,
              data: chartData,
            },
          ],
        };

        setChartOptions(options);
        // setGraphReady(true);
      } else {
        console.error("Error fetching graph data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setLoading(false);
      setStartDate(null);
      setEndDate(null);
      setDateModal(false);
      setIsOpen(false);
    }
  };

  const getGraphDepData = async (_val_FilterationType: number | string) => {
    setLoading(true);
    const fromDate = startDate ? formatDate(startDate) : "";
    const toDate = endDate ? formatDate(endDate) : "";
    const params = {
      restaurantLoginId,
      filterationType: _val_FilterationType,
      fromDate: fromDate,
      toDate: toDate,
    };
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }api/restaurant/reports/graph/subdepartment`,
        params,
        {
          headers: {
            Authorization: `Bearer ${UserToken_Global}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === 1) {
        const data = response.data.data;
        const graphData = data.salesData_SubDepartment || [];
        // setFilterValue(data.filterValue || "No Filter");

        const chartData = graphData.map((item: SalesData) => ({
          name: item.Name,
          y: item.TotalSale_Percentage,
        }));

        setReportDepData(response.data.data);

        const options = {
          chart: {
            type: "pie",
            backgroundColor: "#00afff00",
          },
          title: {
            text: data.salesData_SubDepartment.length > 0 ? "" : "No Data",
            verticalAlign: "middle",
            floating: true,
          },
          tooltip: {
            pointFormat: "{point.name}: <b>{point.y}%</b>",
          },
          plotOptions: {
            pie: {
              size: 250,
              innerSize: "60%",
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
            },
          },
          series: [
            {
              name: "Main Department",
              colorByPoint: true,
              data: chartData,
            },
          ],
        };
        setChartOptions2(options);
      } else {
        console.error("Error fetching graph data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setLoading(false);
      setStartDate(null);
      setEndDate(null);
      setDateModal(false);
      setIsOpen(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("container_content_report");

    if (element) {
      const options = {
        margin: 10,
        filename: "MainDepartmentReport.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(element).set(options).save();
    } else {
      console.error("Report content element not found.");
    }
  };

  const handleCustomDate = () => {
    setFilterType(4);
    setFlag((prevFlag) => !prevFlag);
  };

  useEffect(() => {
    getGraphDepData(filterType);
    getGraphData(filterType);
  }, [filterType, flag]);

  return (
    <>
      <div id="department" className="container-fluid">
        {loading && (
          <div
            style={{
              backgroundColor: "#f0f5f0",
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "300%",
              zIndex: 999999999999999,
              MozOpacity: 0.2,
              opacity: 0.2,
            }}
          >
            <img
              src="/Content/Images/Loader.gif"
              style={{
                backgroundColor: "#9af58c",
                alignItems: "center",
                position: "fixed",
                top: "40%",
                width: "10%",
                left: "50%",
              }}
            />
          </div>
        )}
        <div className="cgt-desc">
          <div className="tabs_wraps-div">
            <ul className="tabs clearfix">
              <li>
                <a
                  id="tab_MainDepartmentReport_ManageRestaurantReports"
                  className={`FinancialReportDataClassCommon ${
                    activeTab === "master_department" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("master_department")}
                >
                  MASTER DEPARTMENT
                </a>
              </li>
              <li>
                <a
                  id="tab_SubDepartmentReport_ManageRestaurantReports"
                  className={`FinancialReportDataClassCommon ${
                    activeTab === "wrap_department" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("wrap_department")}
                >
                  DEPARTMENT
                </a>
              </li>
            </ul>

            <span
              id="FilterOptionsMenu_MainDepartmentReport"
              className="dropbtn FilterOptionsMenuCommonClass Vector_horizental"
              style={{ background: "rgb(246, 248, 252)" }}
              onClick={toggleDropdown}
            >
              <img
                src="/Content/Restaurant/icons/Vector_horizental.png"
                alt="icon"
                className="dropbtn vertical-menus"
              />
            </span>

            {/* Filter Dropdown */}
            <div
              id="dllFilterGraphOption_MainDepartmentReports_ManageReports"
              className={`dropdown-content dropdownContent_FinancialReports ${
                isOpen ? "show" : ""
              }`}
            >
              <a
                id="optFilteration_Weekly_MainDepartmentReports"
                className="optFilterationClass_MainDepartmentReports"
                onClick={() => {
                  handleFilterTypeChange(1);
                  setFlag((prevFlag) => !prevFlag);
                }}
              >
                Weekly
              </a>
              <a
                id="optFilteration_Monthly_MainDepartmentReports"
                className="optFilterationClass_MainDepartmentReports"
                onClick={() => {
                  handleFilterTypeChange(2);
                  setFlag((prevFlag) => !prevFlag);
                }}
              >
                Monthly
              </a>
              <a
                id="optFilteration_Yearly_MainDepartmentReports"
                className="optFilterationClass_MainDepartmentReports"
                onClick={() => {
                  handleFilterTypeChange(3);
                  setFlag((prevFlag) => !prevFlag);
                }}
              >
                Yearly
              </a>
              <a
                id="optFilteration_CustomDates_MainDepartmentReports"
                className="optFilterationClass_MainDepartmentReports"
                onClick={handleDateModal}
              >
                Custom Dates
              </a>
            </div>
          </div>

          <div className="cgt-content">
            <div
              id="master_department"
              className={`tab ${activeTab === "master_department" ? "a" : ""}`}
              style={{
                display: activeTab === "wrap_department" ? "none" : "block",
              }}
            >
              {/* Graph Section */}
              <div className="graph">
                <div className="value_wraps-etc">
                  <div className="row wrap_chart">
                    <div
                      className="col-md-12 col-lg-12"
                      id="lblSelectedFilterOption_SubDepartmentReports_ManageReports"
                      style={{
                        paddingTop: "10px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      {reportData.filterValue}
                    </div>
                    <div className="col-md-12 col-lg-12 department_chart">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="space_wraps" />
              {/* PDF Reports */}
              <div className="pdf_reports">
                <div className="wrap_pdf">
                  <p
                    id="link_Send_MainDepartmentReportPDF"
                    className="Email_wraps-right"
                    style={{ cursor: "pointer" }}
                    onClick={handleEmailModalOpen}
                  >
                    Email
                  </p>

                  <div
                    className="container_content"
                    id="container_content_report"
                  >
                    <div
                      className="invoice-box"
                      style={{
                        maxWidth: "1000px",
                        margin: "auto",
                        padding: "10px",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#555",
                      }}
                    >
                      <h3
                        style={{
                          textAlign: "center",
                          color: "rgb(18 111 39)",
                          fontStyle: "italic",
                        }}
                      >
                        Main-Department Sales Report
                      </h3>
                      <p
                        id="lblFilterValue_MainDepartment_PDFReport_RestaurantReports"
                        style={{ textAlign: "center" }}
                      >
                        {reportData.filterValue2}
                      </p>
                      <div className="table-responsive">
                        <table
                          id="tblMainDepartment_PDFReport_RestaurantReports"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            width: "100%",
                            lineHeight: "inherit",
                            textAlign: "left",
                          }}
                        >
                          <tbody>
                            <tr className="heading">
                              <td colSpan={2}></td>
                              <td
                                colSpan={3}
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  textAlign: "center",
                                  paddingBottom: "0px",
                                }}
                              >
                                Sales
                              </td>
                            </tr>
                            <tr className="heading">
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                }}
                              >
                                Id
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "40%",
                                }}
                              >
                                Name
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                Quantity
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                Amount
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                %
                              </td>
                            </tr>

                            {reportData.salesData_MainDepartment.length > 0 ? (
                              reportData.salesData_MainDepartment.map(
                                (item, index) => (
                                  <tr
                                    className="details rowsMainDepartmentPDFReportCommonClass"
                                    key={index}
                                  >
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                      }}
                                    >
                                      {item.Id}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "40%",
                                      }}
                                    >
                                      {item.Name}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {item.TotalQuantity}{" "}
                                      {/* Use TotalQuantity instead of Quantity */}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                        textAlign: "center",
                                      }}
                                    >
                                      ${item.TotalSale_Amount.toFixed(2)}{" "}
                                      {/* Use TotalSale_Amount instead of Amount */}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {item.TotalSale_Percentage.toFixed(2)}%{" "}
                                      {/* Use TotalSale_Percentage instead of Percentage */}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>
                                  No data available
                                </td>
                              </tr>
                            )}

                            <tr className="total_final department_sale rowsMainDepartmentPDFReportCommonClass">
                              <td style={{ width: "15%" }}></td>
                              <td style={{ width: "40%" }}></td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  borderTop: "1px solid #000",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                {reportData.totalQuantity}{" "}
                                {/* Use totalQuantity */}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  borderTop: "1px solid #000",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                ${reportData.totalSaleAmount_StringFormat}{" "}
                                {/* Use totalSaleAmount_StringFormat */}
                              </td>
                              <td
                                style={{ width: "15%", textAlign: "center" }}
                              ></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* PDF Download */}
                  <div
                    id="dv_Download_MainDepartmentReport_Section"
                    className="text-center"
                    style={{ padding: "20px" }}
                  >
                    <form method="post">
                      <input
                        type="hidden"
                        name="hdn_MainDepartmentReport_Html"
                      />
                      <input
                        type="hidden"
                        name="hdn_MainDepartment_Graph_base64"
                      />
                      <button
                        type="button"
                        id="btnDownload_MainDepartmentReportPDF_RestaurantReports"
                        className="btn btn-info btn_print  text-white  !bg-[#1a8101] hover:!bg-[#156601]"
                        onClick={downloadPDF}
                      >
                        PDF Download
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="wrap_department"
              className={`tab ${activeTab === "wrap_department" ? "" : ""}`}
              style={{
                display: activeTab === "master_department" ? "none" : "block",
              }}
            >
              {/* Filter Dropdown */}
              <div
                id="dllFilterGraphOption_MainDepartmentReports_ManageReports"
                className="dropdown-content dropdownContent_MainDepartmentReports"
              >
                <a
                  id="optFilteration_Weekly_MainDepartmentReports"
                  className="optFilterationClass_MainDepartmentReports"
                  // onClick={() => handleFilterChange('Weekly')}
                >
                  Weekly
                </a>
                <a
                  id="optFilteration_Monthly_MainDepartmentReports"
                  className="optFilterationClass_MainDepartmentReports"
                  // onClick={() => handleFilterChange('Monthly')}
                >
                  Monthly
                </a>
                <a
                  id="optFilteration_Yearly_MainDepartmentReports"
                  className="optFilterationClass_MainDepartmentReports"
                  // onClick={() => handleFilterChange('Yearly')}
                  // style={filterOption === 'Yearly' ? { fontWeight: 'bold' } : {}}
                >
                  Yearly
                </a>
                <a
                  id="optFilteration_CustomDates_MainDepartmentReports"
                  className="optFilterationClass_MainDepartmentReports"
                  onClick={handleDateModal}
                >
                  Custom Dates
                </a>
              </div>

              {/* Graph Section */}
              <div className="graph">
                <div className="value_wraps-etc">
                  <div className="row wrap_chart">
                    <div
                      className="col-md-12 col-lg-12"
                      id="lblSelectedFilterOption_SubDepartmentReports_ManageReports"
                      style={{
                        paddingTop: "10px",
                        textAlign: "center",
                        fontSize: "20px",
                      }}
                    >
                      {reportData.filterValue}
                    </div>
                    <div className="col-md-12 col-lg-12 department_chart">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions2}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="space_wraps" />
              {/* PDF Reports */}
              <div className="pdf_reports">
                <div className="wrap_pdf">
                  <p
                    id="link_Send_MainDepartmentReportPDF"
                    className="Email_wraps-right"
                    style={{ cursor: "pointer" }}
                    onClick={() => console.log("Send PDF via Email")}
                  >
                    Email
                  </p>

                  <div className="container_content" id="container_content">
                    <div
                      className="invoice-box"
                      style={{
                        maxWidth: "1000px",
                        margin: "auto",
                        padding: "10px",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#555",
                      }}
                    >
                      <h3
                        style={{
                          textAlign: "center",
                          color: "rgb(18 111 39)",
                          fontStyle: "italic",
                        }}
                      >
                        Department Sales Report
                      </h3>
                      <p
                        id="lblFilterValue_MainDepartment_PDFReport_RestaurantReports"
                        style={{ textAlign: "center" }}
                      >
                        {reportDepData.filterValue2}
                      </p>
                      <div className="table-responsive">
                        <table
                          id="tblMainDepartment_PDFReport_RestaurantReports"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            width: "100%",
                            lineHeight: "inherit",
                            textAlign: "left",
                          }}
                        >
                          <tbody>
                            <tr className="heading">
                              <td colSpan={2}></td>
                              <td
                                colSpan={3}
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  textAlign: "center",
                                  paddingBottom: "0px",
                                }}
                              >
                                Sales
                              </td>
                            </tr>
                            <tr className="heading">
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                }}
                              >
                                Id
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "40%",
                                }}
                              >
                                Name
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                Quantity
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                Amount
                              </td>
                              <td
                                style={{
                                  padding: "5px",
                                  verticalAlign: "top",
                                  background: "transparent",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                %
                              </td>
                            </tr>
                            {reportDepData.salesData_SubDepartment.length >
                            0 ? (
                              reportDepData.salesData_SubDepartment.map(
                                (item, index) => (
                                  <tr
                                    className="details rowsMainDepartmentPDFReportCommonClass"
                                    key={index}
                                  >
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                      }}
                                    >
                                      {item.Id}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "40%",
                                      }}
                                    >
                                      {item.Name}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {item.TotalQuantity}{" "}
                                      {/* Use TotalQuantity instead of Quantity */}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                        textAlign: "center",
                                      }}
                                    >
                                      ${item.TotalSale_Amount.toFixed(2)}{" "}
                                      {/* Use TotalSale_Amount instead of Amount */}
                                    </td>
                                    <td
                                      style={{
                                        padding: "5px",
                                        paddingBottom: "10px",
                                        verticalAlign: "top",
                                        fontSize: "13px",
                                        width: "15%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {item.TotalSale_Percentage.toFixed(2)}%{" "}
                                      {/* Use TotalSale_Percentage instead of Percentage */}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>
                                  No data available
                                </td>
                              </tr>
                            )}
                            <tr className="total_final department_sale rowsMainDepartmentPDFReportCommonClass">
                              <td style={{ width: "15%" }}></td>
                              <td style={{ width: "40%" }}></td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  borderTop: "1px solid #000",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                {reportData.totalQuantity}{" "}
                                {/* Use totalQuantity */}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  borderTop: "1px solid #000",
                                  borderBottom: "1px solid #000",
                                  fontWeight: "bold",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                ${reportData.totalSaleAmount_StringFormat}{" "}
                                {/* Use totalSaleAmount_StringFormat */}
                              </td>
                              <td
                                style={{ width: "15%", textAlign: "center" }}
                              ></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* PDF Download */}
                  <div
                    id="dv_Download_MainDepartmentReport_Section"
                    className="text-center"
                    style={{ padding: "20px" }}
                  >
                    <form method="post">
                      <input
                        type="hidden"
                        name="hdn_MainDepartmentReport_Html"
                      />
                      <input
                        type="hidden"
                        name="hdn_MainDepartment_Graph_base64"
                      />
                      <button
                        type="submit"
                        id="btnDownload_MainDepartmentReportPDF_RestaurantReports"
                        className="btn btn-info btn_print"
                      >
                        PDF Download
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dateModal && (
        <div
          className="modal fixed inset-0 bg-slate-800 bg-opacity-65 transition-opacity show"
          id="CustomDates_Selection_ManageReports_Modal"
          data-backdrop="static"
          data-keyboard="false"
          style={{ display: "block" }}
        >
          <div className="modal-dialog cstm_modal_dialog">
            <div className="modal-content plus_modal_cont custm_date-wrappopup">
              <div
                className="modal-header plus_modal_head"
                style={{
                  display: "block",
                  paddingBottom: "30px",
                  textAlign: "center",
                  paddingTop: "0px",
                }}
              >
                <h4
                  className="modal-title plus_head_popup"
                  style={{ left: "0px" }}
                >
                  Custom Date
                </h4>
              </div>
              <div className="modal-body new_modal_work">
                <div className="col-md-12 col-lg-12 col-12 p-0">
                  <form>
                    <div className="dates_wraps">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <div
                            className="form-group text_wrap-datepicker"
                            style={{ marginBottom: "5px" }}
                          >
                            <label
                              style={{ width: "auto", marginRight: "8px" }}
                            >
                              From
                            </label>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MM/dd/yyyy"
                              placeholderText="From"
                              className="form-control datetimepickerClass datetimepicker-input"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <div
                            className="form-group text_wrap-datepicker"
                            style={{ marginBottom: "5px" }}
                          >
                            <label
                              style={{ width: "auto", marginRight: "8px" }}
                            >
                              To
                            </label>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MM/dd/yyyy"
                              placeholderText="To"
                              className="form-control datetimepickerClass datetimepicker-input"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <div
                            id="fromDate_error_CustomDatesSelection_ManageReports_Modal"
                            className="errorsClass2"
                            style={{ paddingLeft: "55px" }}
                          ></div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <div
                            id="toDate_error_CustomDatesSelection_ManageReports_Modal"
                            className="errorsClass2"
                            style={{ paddingLeft: "32px" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="modal-bottom plus_modal_bottom"
                      style={{ paddingBottom: "0px", paddingTop: "25px" }}
                    >
                      <button
                        id="btnCancel_CustomDatesSelection_ManageReports_Modal"
                        onClick={() => console.log("closebutton")}
                        type="button"
                        className="cstm_model_plusbtn_1 btn btn-danger"
                        data-dismiss="modal"
                        style={{ display: "none" }}
                      ></button>
                      <button
                        type="button"
                        className="pro-cancel"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        id="btnSubmit_GraphsData_By_CustomDates_ManageReports"
                        type="button"
                        onClick={handleCustomDate}
                        className="pro-submit"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <EmailModal />
    </>
  );
};

export default Department;
