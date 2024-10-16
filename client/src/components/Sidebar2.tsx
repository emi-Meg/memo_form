import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import axios from "axios";
import {
  ChartBarIcon,
  EnvelopeIcon,
  BeakerIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  BookOpenIcon,
  ArrowLeftCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  UserIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type NavItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

interface SidebarProps {
  darkMode: boolean;
  role: string;
}

const Sidebar2: React.FC<SidebarProps> = ({ darkMode, role }) => {
  const [open, setOpen] = useState(false);
  const [totalRequestsSent, setTotalRequestsSent] = useState<number | null>(
    null
  );
  const [totalApprovedRequests, setTotalApprovedRequests] = useState<
    number | null
  >(null);
  const [totalPendingRequests, setTotalPendingRequests] = useState<
    number | null
  >(null);
  const [totalDisapprovedRequests, setTotalDisapprovedRequests] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const navItems: NavItem[] =
    role === "Creator"
      ? [
          {
            title: "Dashboard",
            icon: ChartBarIcon,
            path: "/dashboard",
          },
          { title: "View Request", icon: EnvelopeIcon, path: "/view-memo" },
          {
            title: "Create Request",
            icon: DocumentPlusIcon,
            path: "/create",
          },
          {
            title: "View Explanation",
            icon: DocumentTextIcon,
            path: "/view-explanation",
          },
          /*  {
            title: "Approve Request",
            icon: DocumentCheckIcon,
            path: "/request/approver",
          }, */
          /*  {
            title: "Custom Request",
            icon: UserGroupIcon,
            path: "/request/custom",
          }, */
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ]
      : role === "approver"
      ? [
          {
            title: "Dashboard",
            icon: ChartBarIcon,
            path: "/dashboard",
          },

          {
            title: "Approve Request",
            icon: DocumentCheckIcon,
            path: "/view",
          },
          /*  {
              title: "Custom Request",
              icon: UserGroupIcon,
              path: "/request/custom",
            }, */
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ]
      : role === "BranchHead"
      ? [
          {
            title: "Dashboard",
            icon: ChartBarIcon,
            path: "/dashboard/approver",
          },
          {
            title: "View ",
            icon: EnvelopeIcon,
            path: "/view",
          },
          {
            title: "View Explanation",
            icon: DocumentTextIcon,
            path: "/view-explanation",
          },
         /*  {
            title: "Approve Request",
            icon: DocumentCheckIcon,
            path: "/view",
          }, */
          /*  {
                title: "Custom Request",
                icon: UserGroupIcon,
                path: "/request/custom",
              }, */
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ]
      : role === "Admin"
      ? [
          { title: "Dashboard", icon: ChartBarIcon, path: "/dashboard" },
          { title: "View Request", icon: EnvelopeIcon, path: "/request" },
          { title: "Create Request", icon: DocumentPlusIcon, path: "/create" },
          /*  {
            title: "Custom Request",
            icon: UserGroupIcon,
            path: "/request/custom",
          }, */
          { title: "User", icon: UserPlusIcon, path: "/setup/User" },
          { title: "Branch", icon: BuildingOfficeIcon, path: "/setup/Branch" },
          { title: "Approver", icon: UserIcon, path: "/setup/Approver" },
          {
            title: "Area Manager",
            icon: BeakerIcon,
            path: "/setup/AreaManager",
          },
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ]
      : [
          { title: "Dashboard", icon: ChartBarIcon, path: "/dashboard" },
          { title: "View Request", icon: EnvelopeIcon, path: "/view" },
         
          /*  {
            title: "Custom Request",
            icon: UserGroupIcon,
            path: "/request/custom",
          }, */
          { title: "Help", icon: BookOpenIcon, path: "/help" },
        ];

  useEffect(() => {
    const handleResize = () => {
      // Your resize logic here
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleLogout = () => {
    // Remove token and other user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");

    // Redirect to login page
    navigate("/login");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!token || !role || !id) {
      return;
    }

    let apiUrl = `http://localhost:8000/api/`;

    if (role === "Creator") {
      apiUrl += `total-memo-sent/${id}`;
    } else if (
      role === "User" ||
      role === "BranchHead" ||
      role === "approver"
    ) {
      apiUrl += `total-memo-received/${id}`;
    }

    // Fetch data from the appropriate API endpoint
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Assuming the response structure contains these fields
        setTotalRequestsSent(response.data.totalRequestSent);
        setTotalPendingRequests(response.data.totalPendingRequest);
        setTotalApprovedRequests(response.data.totalApprovedRequest);
        setTotalDisapprovedRequests(response.data.totalDisapprovedRequest);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const listStyle =
    "relative mx-2 group flex items-center text-[18px] text-gray-400 font-medium py-2 pr-3 px-2 cursor-pointer rounded-lg";
  const pStyle = "group-hover:text-primary font text-lg px-2  rounded-lg";
  const iconStyle = "size-[32px] group-hover:text-primary";

  return (
    <div className={`${darkMode ? "dark" : "light"} dark:bg-blackD h-full`}>
      <div
        className={`bg-white dark:bg-blackD ${open ? "w-60" : "w-20"} h-full`}
      >
        <div className="px-2 py-3 h-[68px] flex justify-between items-center border-b-[0.5px] border-gray">
          <img
            src={Logo}
            height={34}
            width={75}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <h1
            className={`text-primary font-bold mr-7 ${
              open ? "visible" : "invisible"
            }`}
          >
            HR Memo
          </h1>
          <ArrowLeftCircleIcon
            className={`size-[34px] text-black dark:text-white -right-2 ml-2 absolute cursor-pointer ${
              open ? "block" : "hidden"
            }`}
            onClick={() => setOpen(false)}
          />
        </div>
        <ul className="mt-[65px] flex-1 w-full">
          <p className="text-[12px] text-gray-400 px-3 w-fit">MENU</p>
          <div className="gap-2 w-full">
            {navItems.map((item) => (
              <Link to={item.path} key={item.title}>
                <li
                  className={`${listStyle} ${
                    !open ? "justify-center" : "hover:bg-[#E7F1F9]"
                  }`}
                >
                  <div
                    className={`p-2 ${
                      !open ? "hover:bg-[#D2E6F7] rounded-lg" : ""
                    }`}
                  >
                    <p></p>
                    <item.icon className={iconStyle} />
                  </div>
                  {open ? (
                    <div className={`flex-1 ${!open ? "hidden" : "block"}`}>
                      <p className={`${pStyle} truncate p-1`}>{item.title}</p>
                    </div>
                  ) : (
                    <div className={`relative group`}>
                      <p
                        className={`${pStyle} truncate p-1 absolute left-full ml-5 top-1/2 transform -translate-y-1/2 bg-[#D2E6F7] rounded-lg ${
                          open
                            ? "hidden"
                            : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                        } transition-opacity`}
                      >
                        {item.title}
                      </p>
                    </div>
                  )}
                </li>
              </Link>
            ))}
            <div
              onClick={handleLogout}
              className="border-t flex justify-center items-center cursor-pointer"
            >
              <div className="flex h-5/6 p-2">
                <ArrowLeftStartOnRectangleIcon
                  className={`${iconStyle} dark:text-white`}
                />
              </div>
              <p
                className={`${pStyle} ${!open ? "hidden" : ""} dark:text-white`}
              >
                Logout
              </p>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar2;
