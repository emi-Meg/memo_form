import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import ApproveSuccessModal from "./ApproveSuccessModal";
import { useNavigate } from "react-router-dom";

type Props = {
  closeModal: () => void;
  record: Record;
  refreshData: () => void;
};
interface header_name {
  name: string;
  position: string;
  branch: string;
}

type Record = {
  re: string;
  memo_body: string;
  explain_body: string;
  header_name: header_name;
  id: number;
  from: string;
  to: string;
  noted_by: {
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
  sincerely: {
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
interface Approver {
  id: number;
  updated_at?: Date;
  firstName: string;
  lastName: string;
  comment: string;
  position: string;
  signature: string;
  status: string;
}
const ViewExplanationModal: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [by, setBy] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [receivedBy, setReceivedBy] = useState<Approver[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    "approved" | "disapproved" | "received"
  >("approved");

  const navigate = useNavigate();
  const formatDate = (dateString: Date | string): string => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  console.log("Header Name:", record.header_name);

  useEffect(() => {
    setApprovedBy(record.approved_by);
    setBy(record.by);
    setReceivedBy(record.received_by);
  }, [record]);

  const handleApprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    const token = localStorage.getItem("token");
  
    if (!token) {
      setErrorMessage("Token is missing");
      return;
    }
  
    // Prepare the request data
    const requestData = {
      user_id: Number(userId), // Ensure userId is a number
      action: "approve", // Action value as specified
    };
  
    try {
      setApproveLoading(true);
  
      // Make the PUT request with the correct headers and request data
      const response = await axios.put(
        `http://localhost:8000/api/explain/${record.id}/process`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure the content type is JSON
            'Accept': 'application/json', // Ensure the accept header is set
          }
        }
      );
  
      console.log('Response:', response);
  
      // Handle success
      setApproveLoading(false);
      setModalStatus("approved");
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setApproveLoading(false);
      console.error('Error:', error.response ? error.response.data : error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      setErrorMessage(errorMessage);
    }
  };
  
  const handleReceive = async () => {
    const userId = localStorage.getItem("id") ?? "";
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Token is missing");
      return;
    }

    const requestData = {
      user_id: Number(userId),
      action: "receive",
    };

    try {
      setApproveLoading(true);

      const response = await axios.put(
        `http://localhost:8000/api/explain/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      setApproveLoading(false);
      setModalStatus("approved");
      setShowSuccessModal(true);
      refreshData();

      // Navigate to create-reply route with the record data
      navigate(`/create-reply`, { state: { record } });
    } catch (error: any) {
      setApproveLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error approving request form:", errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const handleDisapprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token is missing");
        return;
      }

      const requestData = {
        user_id: parseInt(userId),
        action: "disapprove",
      };

      const response = await axios.put(
        `http://localhost:8000/api/explain/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      setLoading(false);
      setModalStatus("disapproved");
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error disapproving request form:", errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  console.log(typeof record.header_name);

  const handleView = async (record: Record) => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    setLoading(true);
    const requestData = {
      user_id: Number(userId),
      action: "receive",
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/api/explain/${record.id}/process`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      if (response.status === 200) {
        setModalIsOpen(true);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error processing memo:", error);
      alert("An error occurred while processing the memo");
    } finally {
      setLoading(false);
    }
  };
  console.log(record);
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full max-w-[8.5in] max-h-[11in] p-4 bg-white border-black rounded-lg shadow-lg overflow-auto transform scale-[0.75]">
        <div className=" top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon
            className="h-8 w-8 text-black   bg-white rounded-full p-1  "
            onClick={closeModal}
          />
        </div>
        <div className="border-2 p-4 m-4 py-10 px-14 h-auto">
          <div className="mb-4">
            {record.date && <p className="">{formatDate(record.date)}</p>}
          </div>
          <div className="mb-4">
            <p className="font-bold">{record.header_name.name}</p>
            <p className="">{record.header_name.position}</p>
            <p className="">{record.header_name.branch}</p>
          </div>
          <div>
            <p className="font-bold flex">
              Thru:{" "}
              <p className="font-bold uppercase ml-1">
                {" "}
                {record.noted_by[0].firstName} {record.noted_by[0].lastName}
              </p>
            </p>
            <p className="">{record.header_name.position}</p>
            <p className="">{record.header_name.branch}</p>
          </div>
          <div className="mt-10">
            <p>Dear Ma'am/Sir:</p>
          </div>
          <div className=" pt-6  max-w-[816px] overflow-hidden">
            <div className="whitespace-normal break-words">
              <div dangerouslySetInnerHTML={{ __html: record.explain_body }} />
            </div>
          </div>
          <div className="pt-6">
            <p>Sincerely,</p>
          </div>
          <div className="relative  flex flex-col items-start justify-start text-start">
            <div className="absolute">
              <img
                src={record.sincerely[0].signature}
                alt="avatar"
                width={120}
                className="relative z-20 pointer-events-none"
              />
            </div>
            <div className="pt-6">
              <p className="uppercase font-bold underline">
                {record.sincerely[0].firstName} {record.sincerely[0].lastName}
              </p>
              <p>{record.sincerely[0].position}</p>
            </div>
          </div>
          {record.noted_by[0].status === "Approved" && (
          <div className="pt-6 h-auto">
            <p>Noted by:</p>
            <div className="relative  flex flex-col items-start justify-start text-start">
            <div className="absolute">
              <img
                src={record.noted_by[0].signature}
                alt="avatar"
                width={120}
                className="relative z-20 pointer-events-none"
              />
            </div>
            <div className="pt-5">
              {" "}
              <p className="uppercase font-bold underline">
                {record.noted_by[0].firstName} {record.noted_by[0].lastName}
              </p>
              <p>{record.noted_by[0].position}</p>
            </div>
            </div>
          </div>
          )}
        </div>
        {}
        {!record.if_creator &&
          (record.if_receiver && record.status === "Pending" ? (
            <div className="w-full space-x-2 px-4 flex items-end justify-end mt-10">
              <button
                className="bg-primary text-white w-1/4 items-center h-10 rounded-xl p-2"
                onClick={handleReceive}
              >
                Receive
              </button>
            </div>
          ) : (
            record.status === "Pending" && (
              <div className="w-full space-x-2 px-4 flex items-end justify-end mt-10">
                <button
                  className="bg-primary text-white w-1/4 items-center h-10 rounded-xl p-2"
                  onClick={handleApprove}
                >
                  {approveLoading ? (
                    <BeatLoader color="white" size={10} />
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  className="bg-red-600 w-1/4 rounded-xl text-white p-2"
                  onClick={handleDisapprove}
                >
                  {loading ? (
                    <BeatLoader color="white" size={10} />
                  ) : (
                    "Disapprove"
                  )}
                </button>
              </div>
            )
          ))}
      </div>
      {showSuccessModal && (
        <ApproveSuccessModal
          closeModal={() => setShowSuccessModal(false)}
          closeParentModal={closeModal}
          status={modalStatus}
        />
      )}
    </div>
  );
};

export default ViewExplanationModal;
