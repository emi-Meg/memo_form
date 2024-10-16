import React, { useState, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface AddCustomModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  openCompleteModal: () => void;
  entityType: string;
  initialBranchHeads: Approver[]; // Updated

  refreshData: () => void;
  handleAddCustomData: (branchHeads: Approver[]) => void; // Updated
}

interface Approver {
  id: number;
  firstName: string;
  lastName: string;
  comment?: string;
  position: string;
  signature?: string;
  status?: string;
}

const AddBranchHead: React.FC<AddCustomModalProps> = ({
  modalIsOpen,
  closeModal,
  openCompleteModal,
  entityType,
  initialBranchHeads,
  refreshData,
  handleAddCustomData,
}) => {
  const [branchHeads, setBranchHeads] = useState<Approver[]>([]); // Updated
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(null); // No default selection

  useEffect(() => {
    if (modalIsOpen) {
      setBranchHeads(initialBranchHeads); // Updated

      const fetchApprovers = async () => {
        try {
          setLoading(true);
          const userId = localStorage.getItem("id");
          const response = await axios.get(
            `http://localhost:8000/api/get-explain-approvers/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setApprovers(response.data.branchHead);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching approvers:", error);
          setLoading(false);
        }
      };

      fetchApprovers();
    }
  }, [modalIsOpen]);

  const filteredApprovers = approvers.filter((approver) =>
    Object.values(approver).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleResetSelection = () => {
    setSelectedApprover(null); // Reset selected approver
    setBranchHeads([]); // Updated
  };

  const toggleBranchHead = (approver: Approver) => {
    if (selectedApprover?.id === approver.id) {
      setSelectedApprover(null); // Deselect if already selected
      setBranchHeads([]);
    } else {
      setSelectedApprover(approver);
      setBranchHeads([approver]); // Only allow one branch head to be selected
    }
  };

  const isSelected = (approver: Approver) => {
    return selectedApprover?.id === approver.id;
  };

  const handleCancel = () => {
    setSelectedApprover(null); // Reset selected approver
    setBranchHeads([]); // Updated
    setSearchTerm("");
    closeModal();
  };

  const handleAddCustomRequest = () => {
    if (branchHeads.length === 0) {
      setErrorMessage("You must select at least one branch head.");
      return;
    }

    handleAddCustomData(branchHeads); // Updated

    setSelectedApprover(null); // Reset selected approver
    setBranchHeads([]); // Updated
    setSearchTerm("");
    setErrorMessage("");
    closeModal();
  };

  if (!modalIsOpen) return null;

  return (
    <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 flex-col">
      <div className="bg-white w-10/12 sm:w-1/3 mx-20 flex flex-col rounded-lg shadow-lg">
        <div className="p-4 bg-primary flex justify-center items-center rounded-t-lg">
          <h2 className="text-center text-xl md:text-2xl font-bold text-white">
            Add {entityType}
          </h2>
        </div>
        <div className="flex-grow p-4">
          <div className="relative flex items-center mb-4">
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search approvers"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto h-80">
            <div>
              <h1 className="text-lg font-medium">Branch Heads</h1>
              {filteredApprovers.map((approver) => {
                const highlightClass = isSelected(approver) ? "bg-yellow-100" : "";

                return (
                  <div key={approver.id} className="flex items-center mb-2">
                    <input
                      type="radio"
                      className="h-5 w-5 mr-2"
                      id={`branch_head_${approver.id}`}
                      checked={isSelected(approver)}
                      onChange={() => toggleBranchHead(approver)}
                    />
                    <label
                      htmlFor={`branch_head_${approver.id}`}
                      className={highlightClass}
                    >
                      {approver.firstName} {approver.lastName}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          {errorMessage && (
            <div className="mt-4 text-red-500">{errorMessage}</div>
          )}
        </div>
        <div className="p-4 flex-col md:flex-row gap-2 bg-gray-100 flex justify-end rounded-b-lg">
          <button
            type="button"
            onClick={handleResetSelection}
            className="bg-gray-300 px-2 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 px-2 hover:bg-gray-400 text-white font-medium py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddCustomRequest}
            className="bg-primary px-2 hover:bg-blue-400 hover:bg-primary-dark text-white font-medium py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
      {loading && (
        <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <ClipLoader color="white" size={40} />
        </div>
      )}
    </div>
  );
};

export default AddBranchHead;
