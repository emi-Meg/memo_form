import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import ViewMemoModal from "../components/Modals/ViewMemoModal";
type Props = {};

type Record = {
  firstName: string;
  lastName: string;
  re: string;
  id: number;
  memo_body: string;
  to: {
    id: number;

    firstName: string;
    lastName: string;
    firstname: string;
    lastname: string;
    position: string;
    branch: string;
    branch_code: string;
  };
  from: string;
  received_by: {
    id: number;

    firstName: string;
    lastName: string;
    firstname: string;
    lastname: string;
    comment: string;
    position: string;
    signature: string;
    status: string;
  }[];
  by: {
    id: number;

    firstName: string;
    lastName: string;
    firstname: string;
    lastname: string;
    comment: string;
    position: string;
    signature: string;
    status: string;
  }[];
  approved_by: {
    id: number;
    firstName: string;
    lastName: string;
    comment: string;
    firstname: string;
    lastname: string;
    position: string;
    signature: string;
    status: string;
  }[];
  user_id: number;
  date: Date;
  created_at: Date;
  branch: string;
  status: string;
  if_receiver: boolean;
  if_creator: boolean;
};

const tableCustomStyles = {
  headRow: {
    style: {
      color: "black",
      backgroundColor: "#FFFF",
    },
  },
  rows: {
    style: {
      color: "STRIPEDCOLOR",
      backgroundColor: "STRIPEDCOLOR",
    },
    stripedStyle: {
      color: "NORMALCOLOR",
      backgroundColor: "#E7F1F9",
    },
  },
};

const View = (props: Props) => {
  const [selected, setSelected] = useState(0);
  const [requests, setRequests] = useState<Record[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const userId = localStorage.getItem("id");
  const [branchList, setBranchList] = useState<any[]>([]);
  const [branchMap, setBranchMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserInfoFromDatabase = async () => {
      const id = localStorage.getItem("id");
      if (!id) {
        console.error("No user ID found in localStorage.");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/view-user/${id}`
        );
        console.log(response.data);
        if (response.data && response.data.data) {
          setRole(response.data.data.role);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching user information from the database: ",
          error
        );
      }
    };

    fetchUserInfoFromDatabase();
  }, []);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          `http://122.53.61.91:6002/api/view-branch`
        );
        const branches = response.data.data;

        // Create a mapping of id to branch_code
        const branchMapping = new Map<number, string>(
          branches.map((branch: { id: number; branch_code: string }) => [
            branch.id,
            branch.branch_code,
          ])
        );

        setBranchList(branches);
        setBranchMap(branchMapping);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchBranchData();
  }, []);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`http://localhost:8000/api/memo/for-approval/${userId}`, {
          headers,
        })
        .then((response) => {
          setRequests(response.data.memo);
          console.log(response.data); // Assuming response.data.data contains your array of data
        })

        .catch((error) => {
          console.error("Error fetching requests data:", error);
        });
    }
  }, [userId]);

  const handleClick = (index: number) => {
    setSelected(index);
  };
  const handleView = async (record: Record) => {
    setSelectedRecord(record);
    setModalIsOpen(true);
  };

  const filteredData = () => {
    if (!Array.isArray(requests)) {
      return [];
    }

    switch (selected) {
      case 0: // All Requests
        return requests;
      case 1: // Pending Requests
        return requests.filter(
          (item: Record) =>
            item.status.trim() === "Pending" || item.status.trim() === "Ongoing"
        );
      case 2: // Approved Requests
        return requests.filter(
          (item: Record) => item.status.trim() === "Approved"
        );
      case 3: // Unsuccessful Requests
        return requests.filter(
          (item: Record) => item.status.trim() === "Disapproved"
        );
      default:
        return requests;
    }
  };

  const refreshData = () => {
    if (userId) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`http://localhost:8000/api/memo/for-approval/${userId}`, {
          headers,
        })
      
        .then((response) => {
          setRequests(response.data.memo);
          console.log(response.data); // Assuming response.data.data contains your array of data
        })

        .catch((error) => {
          console.error("Error fetching requests data:", error);
        });
    }
  };
  const columns = [
    {
      name: "Memo ID",
      selector: (row: Record) => row.id,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row: Record) => row.re,
    },
    {
      name: "To",
      selector: (row: Record) => row.to.firstName + " " + row.to.lastName,
    },
    {
      name: "Date",
      selector: (row: Record) =>
        new Date(row.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      sortable: true,
    },

    // Conditionally add the Status column if role is not "User"
    ...(role !== "User"
      ? [
          {
            name: "Status",
            selector: (row: Record) => row.status,
            sortable: true,
            width: "320px",
            cell: (row: Record) => (
              <div className="relative flex items-center group w-full">
                {/* Status Badge */}
                <div
                  className={`${
                    row.status.trim() === "Pending"
                      ? "bg-yellow"
                      : row.status.trim() === "Approved"
                      ? "bg-green"
                      : row.status.trim() === "Disapproved"
                      ? "bg-pink"
                      : row.status.trim() === "Ongoing"
                      ? "bg-blue-500"
                      : row.status.trim() === "Received"
                      ? "bg-[#04bbac] "
                      : "bg-red-600"
                  } rounded-lg py-1 px-3 text-center text-white flex items-center`}
                >
                  {row.status.trim()}
                </div>
              </div>
            ),
          },
        ]
      : []), // No Status column for users with role "User"

    {
      name: "Action",
      cell: (row: Record) => (
        <div className="justify-end flex items-end">
          <button
            className="bg-primary text-white px-3 py-1 justify-end items-end rounded-[16px]"
            onClick={() => handleView(row)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const items = [
    "All Requests",
    "Pending Requests",
    "Approved Requests",
    "Unsuccessful Requests",
  ];

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="bg-graybg dark:bg-blackbg w-full h-lvh pt-4 px-10 md:px-10 lg:px-30">
      <div className="w-full  h-auto  drop-shadow-lg rounded-lg  md:mr-4 relative ">
        <div className="bg-white   rounded-lg  w-full flex flex-col items-center overflow-x-auto">
          <div className="w-full border-b-2  md:px-30">
            <ul className=" px-2 md:px-30 flex justify-start items-center space-x-4 md:space-x-6 py-4 font-medium overflow-x-auto">
              {items?.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`cursor-pointer hover:text-primary px-2 ${
                    selected === index ? "underline text-primary" : ""
                  } underline-offset-8 decoration-primary decoration-2`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-4">
                <ClipLoader color={"#123abc"} loading={loading} size={50} />
              </div>
            ) : filteredData() ? (
              <DataTable
                columns={columns}
                defaultSortAsc={false}
                data={filteredData()
                  .map((item: Record) => ({
                    ...item,
                    created_at: new Date(item.created_at),
                  }))
                  .sort((a, b) => b.id - a.id)} // Sorting by ID in descending order
                pagination
                striped
                customStyles={tableCustomStyles}
              />
            ) : (
              <div className="text-center py-4">
                There are no records to display
              </div>
            )}
          </div>
        </div>
      </div>
      {modalIsOpen && selectedRecord && (
        <ViewMemoModal
          closeModal={closeModal}
          record={{ ...selectedRecord }}
          refreshData={refreshData}
        />
      )}
    </div>
  );
};

export default View;
