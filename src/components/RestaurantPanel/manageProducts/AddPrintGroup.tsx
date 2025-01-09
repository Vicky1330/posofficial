import React, { useEffect, useState } from "react";
// import CreatePrintGroupModal from "";
import { Link } from "react-router-dom";
import CreatePrintGroupModal from "./Models/CreatePrintGroupModal";
import axios from "axios";
import Swal from "sweetalert2";
import { Bounce, toast,} from "react-toastify";

interface Printgroup {
  id: number;
  name: string;
  status: number;
}

const AddPrintGroup: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [printGroups, setPrintGroups] = useState<Printgroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const editMainDepartment = (id: number, groupName: string) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setSelectedGroup(groupName);
    setSelectedGroupId(id);
  };

  const toggleDeleteOption = () => {
    setDeleteEnabled((prev) => !prev);
  };

  const confirmDeleteMainDepartment = (id: number) => {
    Swal.fire({
      title: "Delete Main-Department",
      text: "Are you sure to delete this Main-Department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMainDepartment(id);
      }
    });
  };

  const deleteMainDepartment = async (id: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/restaurant/delete/printgroup?printGroupId=${id}&restaurantLoginId=${0}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data.status === 1) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error("Unauthorized! Invalid Token!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          } else {
            toast.error("There is some technical error, please try again!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        }
      } else {
        toast.error("An unexpected error occurred!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getMaindepartmentData = async () => {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/api/restaurant/printgroup/list?restaurantLoginId=0`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data.status === 1) {
        const data = response.data.data.printGroupsList;

        const depData = data.map((dept: any) => ({
          id: dept.Id,
          name: dept.Name,
          status: dept.Status,
        }));
        setPrintGroups(depData);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error("Unauthorized! Invalid Token!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          } else {
            toast.error("There is some technical error, please try again!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        }
      } else {
        toast.error("An unexpected error occurred!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrintGroupData = async (action: number, group: string) => {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${
      import.meta.env.VITE_API_URL
    }/api/restaurant/addupdate/printgroup`;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("id", String(selectedGroupId || 0));
      formData.append("restaurantLoginId", "0");
      formData.append("name", group);
      formData.append("mode", String(action));

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          mimeType: "multipart/form-data",
        },
      });
      if (response.status === 200 && response.data.status === 1) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else if (response.data.status === -2) {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else if (response.data.status === 2) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error("Unauthorized! Invalid Token!", {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          } else {
            toast.error("There is some technical error, please try again!", {
              position: "bottom-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
        }
      }
    } finally {
      setIsModalOpen(false);
      setIsEdit(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMaindepartmentData();
  }, [isLoading]);

  return (
    <div
      id="contentWrapper_RestaurantLayout"
      className="department-class sidebar-icon-only min-vh-100 p-2"
    >
      <div className="top_area_row">
        <div className="row">
          <div className="col-sm-8">
            <section>
              <div className="pl-1 main_nav_bread">
                <ol className="breadcrumb pl-3">
                  <li className="breadcrumb-item nav_bread_one ">
                    <Link
                      className="fs-6 fw-bold"
                      to="/Restaurant/ManageProducts"
                    >
                      Products
                    </Link>
                  </li>
                  <li className="breadcrumb-item nav_right pl-1 px-2">
                    <a
                      href="javascript:;"
                      className="fs-6 fw-bold"
                      style={{ textDecoration: "none", cursor: "text" }}
                    >
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item nav_bread_two pl-0">
                    <Link
                      to=""
                      className="fs-6 fw-bold"
                      style={{ textDecoration: "none", cursor: "text" }}
                    >
                      Print Group
                    </Link>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        </div>

        <div className=" main-dept-bx">
          <div className="main_deapt main-dept-bx">
            <div className="row align-items-center">
              <div className="col-sm-10">
                <h2 className="mb-0">PRINT GROUP</h2>
              </div>
              <div className="col-sm-2">
                <div className="check_wrap-right">
                  <div className="form-group mb-0">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        className="sb-checkbox__input cstm_wrap_uppr"
                        id="chkDeletePrintGroup_ManagePrintGroups"
                        name="chkDeletePrintGroup_ManagePrintGroups"
                        checked={deleteEnabled}
                        onChange={toggleDeleteOption}
                      />
                      <label
                        className="sb-checkbox__label sb-checkbox__label--green wrap_label_check"
                        htmlFor="chkDeletePrintGroup_ManagePrintGroups"
                      ></label>
                      <span className="onlie_prder"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="main_dept_below space-y-4">
              <div
                id="dv_PrintGroupsList_Section_ManagePrintGroups"
                className="row ui-sortable space-y-4"
              >
                {printGroups.map((group) => (
                  <div
                    key={group.id}
                    className="col-sm-2 printGroupsListClass"
                    data-pgid={group.id}
                  >
                    <div className="wrap_chekox-remove pt-2">
                      <span>
                        <a
                          href="#"
                          title={group.name}
                          onClick={() =>
                            editMainDepartment(group.id, group.name)
                          }
                          className="text-lg font-semibold hover-underline"
                        >
                          {group.name}
                        </a>
                      </span>
                      <span
                        className="removecions removeIconPrintGroupClass"
                        style={{ display: deleteEnabled ? "inline" : "none" }}
                        onClick={() => confirmDeleteMainDepartment(group.id)}
                      >
                        <span className="material-symbols-outlined">
                          remove
                        </span>
                      </span>
                    </div>
                  </div>
                ))}

                <div className="col-sm-2 wrapadd-plus-cion pt-0">
                  <div className="svg_plus_icon">
                    <a href="#" onClick={openModal}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                      >
                        <g transform="translate(-688.5 -285.5)">
                          <line
                            y2="16"
                            transform="translate(697.5 286.5)"
                            fill="none"
                            stroke="#1c2126"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></line>
                          <line
                            x2="16"
                            transform="translate(689.5 294.5)"
                            fill="none"
                            stroke="#1c2126"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></line>
                        </g>
                      </svg>
                    </a>
                  </div>

                  {isModalOpen && (
                    <CreatePrintGroupModal
                      onClose={closeModal}
                      onCreateMainDepartment={(action, departmentValue) => {
                        updatePrintGroupData(action, departmentValue);
                      }}
                      editModal={isEdit}
                      selectedGroupName={selectedGroup}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrintGroup;
