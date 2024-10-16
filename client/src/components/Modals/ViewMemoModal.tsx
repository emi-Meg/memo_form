import React, { useState, useEffect, ChangeEvent } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BeatLoader, ClipLoader } from "react-spinners";
import axios from "axios";
import ApproveSuccessModal from "./ApproveSuccessModal";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AddCustomModal from "../../pages/AddCustomModal";
type Props = {
  closeModal: () => void;
  record: Record;
  refreshData: () => void;
};

type Record = {
  firstName: string;
  lastName: string;
  re: string;
  memo_body: string;
  id: number;
  from: string;
  to: {
    id: number;
    firstName: string;
    lastName: string;
    firstname: string;
    lastname: string;
    position: string;
    branch_code: string;
    branch: string;
  };
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
const ViewMemoModal: React.FC<Props> = ({
  closeModal,
  record,
  refreshData,
}) => {
  const [by, setBy] = useState<Approver[]>([]);
  const [importedBy, setImportedBy] = useState<Approver[]>([]);
  const [importedApproved, setImportedApproved] = useState<Approver[]>([]);
  const [approvedBy, setApprovedBy] = useState<Approver[]>([]);
  const [receivedBy, setReceivedBy] = useState<Approver[]>([]);
  const [editableBy, setEditableBy] = useState<Approver[]>([]);
  const [editableApprovedBy, setEditableApprovedBy] = useState<Approver[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<any[]>([]);
  const [filteredUserList, setFilteredUserList] = useState<Record[]>([]);
  const [userList, setUserList] = useState<Record[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editableRecord, setEditableRecord] = useState(record);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [disapprovedLoading, setDisapprovedLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [noted_by, setNoted_by] = useState<Approver[]>([]);
  const [fromby, setFromby] = useState<Approver[]>([]);
  const [approved_by, setApproved_by] = useState<Approver[]>([]);
  const [modalStatus, setModalStatus] = useState<
    "approved" | "disapproved" | "received"
  >("approved");
  const [notedBy, setNotedBy] = useState<Approver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };
  const closeViewModal = () => {
    setIsModalOpen(false);
  };
  const [selectedRecipientsInitialized, setSelectedRecipientsInitialized] =
    useState(false);

  useEffect(() => {
    // When editing starts, populate selectedRecipients with record.to
    if (isEditing && !selectedRecipientsInitialized) {
      setSelectedRecipients([record.to]);
      setSelectedRecipientsInitialized(true);
    }
  }, [isEditing, record.to]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.error("User ID is missing");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:8000/api/view-all-users`,
          { headers }
        );
     

        setUserList(response.data.data);
        setFilteredUserList(response.data.data);
       
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    setBy(record.by);
    setImportedBy(record.by);
    setImportedApproved(record.approved_by);
    setApprovedBy(record.approved_by);
    setReceivedBy(record.received_by);
    setEditableBy(record.by);
    setEditableApprovedBy(record.approved_by);
  }, [record]);
 
  const handleAddCustomData = (notedBy: Approver[], approvedBy: Approver[]) => {
    setFromby(importedBy);
    setApprovedBy(importedApproved);

    if (isEditing) {
      setEditableBy(notedBy);
      setEditableApprovedBy(approvedBy);
    }
  };

 
  const handleApprove = async () => {
    const userId = localStorage.getItem("id") ?? "";
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Token is missing");
      return;
    }
    const requestData = {
      user_id: Number(userId),
      action: "approve",
    };
    try {
      setApproveLoading(true);
      
      const response = await axios.put(
        `http://localhost:8000/api/memo/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApproveLoading(false);
      setModalStatus("approved");
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setApprovedLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error approving request form:", errorMessage);
      setErrorMessage(errorMessage);
    }
  };
  const addRecipient = (user: Record) => {
    setSelectedRecipients((prev) => [...prev, user]);
  };

  const removeRecipient = (userId: number) => {
    setSelectedRecipients((prev) =>
      prev.filter((recipient) => recipient.id !== userId)
    );
  };
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the user list based on the query
    const filtered = userList.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query)
    );

    setFilteredUserList(filtered);
  };
  const handleReply = () => {
    navigate(`/create-reply`, { state: { record } });
  }
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
        `http://localhost:8000/api/memo/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApproveLoading(false);
      setModalStatus("received");
      setShowSuccessModal(true);
      refreshData();
      // Navigate to create-reply route with the record data
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
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Token is missing");
      return;
    }
    const requestData = {
      user_id: Number(userId),
      action: "disapprove",
    };
    try {
      setDisapprovedLoading(true);
      
      const response = await axios.put(
        `http://localhost:8000/api/memo/${record.id}/process`,
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDisapprovedLoading(false);
      setModalStatus("disapproved");
      setShowSuccessModal(true);
      refreshData();
    } catch (error: any) {
      setDisapprovedLoading(false);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update stock requisition.";
      console.error("Error approving request form:", errorMessage);
      setErrorMessage(errorMessage);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      // Entering edit mode, copy the current values to editable states
      setEditableBy(by);
      setEditableApprovedBy(approvedBy);
    } else {
      // Exiting edit mode, reset to the original values
      setBy(editableBy);
      setApprovedBy(editableApprovedBy);
    }
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: "comment" | "position"
  ) => {
    const { value } = e.target;
    const updatedArray = [...editableApprovedBy];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setEditableApprovedBy(updatedArray);
  };
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
        `http://localhost:8000/api/memo/${record.id}/process`,
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
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing, revert changes
  const handleCancel = () => {
    setSelectedRecipients([]); // Clear selected recipients
    setSearchQuery(""); // Clear search input
    setEditableRecord(record); // reset editableRecord to the original record
    setIsEditing(false);
    setBy(record.by);
    setApprovedBy(record.approved_by);
  };
console.log(record)
  // Save changes
 const handleSave = async () => {
  
   const userId = localStorage.getItem("id");
   const token = localStorage.getItem("token");
 
   if (!token) {
     setErrorMessage("Token is missing");
     return;
   }
   const byID= editableBy.map(item => item.id)
   const toID= selectedRecipients.map(item => item.user_id)
   const approved_byID= editableApprovedBy.map(item => item.id)
   const requestData = {
     user_id: Number(userId),
     date: editableRecord.date,
     re: editableRecord.re,
     to: toID[0],
     memo_body: editableRecord.memo_body,
     by: byID,
     approved_by: approved_byID,
   };
   console.log('requestData:', requestData);
 
   try {
     console.log("Request sent");
     setApproveLoading(true);
 
     const response = await axios.post(
       `http://localhost:8000/api/update-memo/${record.id}`,
       requestData,
       { headers: { Authorization: `Bearer ${token}` } }
     );
 
     console.log('Request successful');
     console.log(requestData);
     console.log(response);
     setApproveLoading(false);
     setModalStatus("approved");
     setShowSuccessModal(true);
     refreshData();
   } catch (error: any) {
     console.error('Request failed');
     setApprovedLoading(false);
     const errorMessage =
       error.response?.data?.message ||
       error.message ||
       "Failed to update stock requisition.";
     console.error("Error approving request form:", errorMessage);
     setErrorMessage(errorMessage);
   }
 };

  // Handle changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableRecord((prev) => ({ ...prev, [name]: value })); // update the editableRecord
  };

  const openAddCustomModal = () => {
    setIsModalOpen(true);
  };



  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full max-w-[8.5in] max-h-[11in] p-4 bg-white border-black rounded-lg shadow-lg overflow-auto transform scale-[0.75]">
        <div className="top-2 flex justify-end cursor-pointer sticky">
          <XMarkIcon
            className="h-8 w-8 text-black bg-white rounded-full p-1"
            onClick={closeModal}
          />
        </div>
        <div className="border-2 p-4 m-4 py-10 px-14 h-auto">
          <div>
            <div>
              <h1 className="text-center font-bold text-4xl mb-6">
                MEMORANDUM
              </h1>
            </div>

            {/* Editable Date */}

            <p className="flex text-lg">
              Date:
              {isEditing ? (
                <input
                  type="date"
                  value={moment(editableRecord.date).format("YYYY-MM-DD")}
                  onChange={(e) => {
                    const dateValue = new Date(e.target.value);
                    setEditableRecord({ ...editableRecord, date: dateValue });
                  }}
                  className="ml-5"
                  disabled={!isEditing}
                />
              ) : (
                <span className="ml-5">{formatDate(record.date)}</span>
              )}
            </p>
            {/* Editable To */}
            <div className="relative w-full items-center flex">
              <h3 className="text-lg mr-2">To:</h3>

              {isEditing ? (
                <>
                  {/* Show input field or selected recipient */}
                  {selectedRecipients.length === 0 ? (
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-1 border-none p-1 outline-none mt-2"
                      placeholder="Search by name..."
                    />
                  ) : (
                    <div className="flex items-center border border-gray-300 rounded-sm p-1 bg-white mt-2">
                      <span className="text-sm">
                        {selectedRecipients[0].firstName}{" "}
                        {selectedRecipients[0].lastName}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() =>
                          removeRecipient(selectedRecipients[0].id)
                        }
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Show search results if the query is entered and no recipient is selected */}
                  {searchQuery && selectedRecipients.length === 0 && (
                    <div className="absolute top-full left-0 w-full mt-1 border border-gray-300 rounded-sm z-10 bg-white">
                      <ul className="max-h-60 overflow-y-auto">
                        {/* Show search results excluding already selected recipients */}
                        {filteredUserList
                          .filter(
                            (user) =>
                              !selectedRecipients.some(
                                (recipient) => recipient.id === user.id
                              )
                          )
                          .slice(0, 5) // Limit to 5 users
                          .map((user) => (
                            <li
                              key={user.id}
                              className="w-full cursor-pointer hover:bg-gray-300 p-2 rounded"
                              onClick={() => addRecipient(user)} // Add the selected user
                            >
                              {user.firstName} {user.lastName}
                            </li>
                          ))}

                        {/* Show message if no users found */}
                        {filteredUserList.length === 0 && (
                          <p className="p-2">No users found</p>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Display selected recipients when not editing */}
                  {selectedRecipients.length > 0 ? (
                    <div className="flex items-center border border-gray-300 rounded-sm p-1 bg-white">
                      <p className="flex-1 p-1 font-bold">
                        {selectedRecipients[0].firstName}{" "}
                        {selectedRecipients[0].lastName}
                      </p>
                    </div>
                  ) : (
                    <div className="font-bold text-lg">
                      {record.to.firstName} {record.to.lastName} -{" "}
                      {record.to.position} - {record.to.branch} -{" "}
                      {record.to.branch_code}
                    </div>
                  )}
                </>
              )}
            </div>
            {/* Editable From */}
            <p className="flex text-lg">
              From: <p className="ml-5 ">{record.from}</p>
            </p>

            {/* Editable Re */}
            <p className="flex text-lg">
              Re:
              <input
                type="text"
                value={editableRecord.re}
                onChange={(e) =>
                  setEditableRecord({ ...editableRecord, re: e.target.value })
                }
                className="ml-5"
                disabled={!isEditing}
              />
            </p>
          </div>

          <div className="border-t px-2 pt-10 py-10 custom-list text-base">
            <div
              dangerouslySetInnerHTML={{ __html: editableRecord.memo_body }}
              contentEditable={isEditing}
              onInput={(e) =>
                setEditableRecord({
                  ...editableRecord,
                  memo_body: e.currentTarget.innerHTML,
                })
              }
            />
          </div>
          {record.if_creator && record.status === "Pending" && isEditing && (
            <div className="mb-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={openAddCustomModal}
              >
                Edit Approvers
              </button>
            </div>
          )}
          {/* Signature Section */}
          <div className="mb-4 ml-5">
            <h3 className="font-bold mb-3">By:</h3>
            <ul className="flex flex-wrap gap-6">
              {(isEditing ? editableBy : by)?.map((user, index) => (
                <li
                  className="flex flex-col items-center justify-center text-center relative"
                  key={index}
                >
                  <div className="relative flex flex-col items-start justify-start text-start">
                    {/* Signature */}
                    {(user.status === "Approved" ||
                      (typeof user.status === "string" &&
                        user.status.split(" ")[0] === "Rejected")) && (
                      <div className="absolute top-0">
                        <img
                          src={user.signature}
                          alt="avatar"
                          width={120}
                          className="relative z-20 pointer-events-none"
                        />
                      </div>
                    )}
                    {/* Name */}
                    <p className="relative inline-block uppercase font-medium text-start mt-4 z-10">
                      <span className="relative z-10">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                    </p>
                    {/* Position */}
                    <p className="font-bold text-[12px] text-start mt-1">
                      {user.position}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4 ml-5">
            <h3 className="font-bold mb-3">Approved By:</h3>
            <ul className="flex flex-wrap gap-6">
              {(isEditing ? editableApprovedBy : approvedBy)?.map(
                (user, index) => (
                  <li
                    className="flex flex-col items-center justify-center text-center relative"
                    key={index}
                  >
                    <div className="relative flex flex-col items-start justify-start text-start">
                      {/* Signature */}
                      {(user.status === "Approved" ||
                        (typeof user.status === "string" &&
                          user.status.split(" ")[0] === "Rejected")) && (
                        <div className="absolute top-0">
                          <img
                            src={user.signature}
                            alt="avatar"
                            width={120}
                            className="relative z-20 pointer-events-none"
                          />
                        </div>
                      )}
                      {/* Name */}
                      <p className="relative inline-block uppercase font-medium text-start mt-4 z-10">
                        <span className="relative z-10">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                      </p>
                      {/* Position */}
                      <p className="font-bold text-[12px] text-start mt-1">
                        {user.position}
                      </p>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>

          {record.received_by[0].status === "Received" && (
            <div className="mb-4 ml-5">
              <h3 className="font-bold mb-3">Received By:</h3>
              <ul className="flex flex-wrap gap-6">
                {receivedBy?.map((user, index) => (
                  <li
                    className="flex flex-col items-center justify-center text-center relative"
                    key={index}
                  >
                    <div className="relative flex flex-col items-center justify-center text-center">
                      {/* Signature */}
                      {(user.status === "Approved" ||
                        (typeof user.status === "string" &&
                          user.status.split(" ")[0] === "Rejected")) && (
                        <div className="absolute top-0">
                          <img
                            src={user.signature}
                            alt="avatar"
                            width={120}
                            className="relative z-20 pointer-events-none"
                          />
                        </div>
                      )}
                      {/* Name */}
                      <p className="relative inline-block uppercase font-medium text-center mt-4 z-10">
                        <span className="relative z-10">
                          {user.firstName} {user.lastName} -{" "}
                          {formatDate(
                            user.updated_at
                              ? new Date(user.updated_at)
                              : new Date()
                          )}
                        </span>
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
                      </p>
                      {/* Position */}
                      <p className="font-bold text-[12px] text-center mt-1">
                        {user.position}
                      </p>
                      <div className="absolute -top-3">
                        <img
                          src={user.signature}
                          alt="avatar"
                          width={120}
                          className="relative z-20 pointer-events-none"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {record.if_creator && record.status ==="Pending" && (
          <div className="w-full space-x-2 px-4 flex items-end justify-end mt-10">
            {!isEditing ? (
              <>
                <button
                  className="bg-primary text-white w-1/4 items-center h-10 rounded-xl p-2"
                  onClick={toggleEditMode}
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-primary text-white w-1/4 items-center h-10 rounded-xl p-2"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-600 w-1/4 rounded-xl text-white p-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
        {!record.if_creator &&
          (record.if_receiver  ? (
            <div className="w-full space-x-2 px-4 flex items-end justify-end mt-10">
                {record.status === "Pending" && (
                  
                
                <button
                className="bg-green text-white w-1/4 items-center h-10 rounded-xl p-2"
                onClick={handleReceive}
              >
                Receive
              </button>
              )}
              <button
                className="bg-primary text-white w-1/4 items-center h-10 rounded-xl p-2"
                onClick={handleReply}
              >
                Reply
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
      <AddCustomModal
        modalIsOpen={isModalOpen}
        closeViewModal={closeViewModal}
        openCompleteModal={() => {}}
        entityType="Approver"
        initialNotedBy={importedBy}
        initialApprovedBy={importedApproved}
        refreshData={() => {}}
        handleAddCustomData={handleAddCustomData}
      />
    </div>
  );
};
export default ViewMemoModal;
