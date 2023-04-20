/** @format */

import { useState, useEffect } from "react";
import UserDashboard from "../../../components/UserDashboard";
import { RootStateOrAny, useSelector } from "react-redux";
import ClientTable from "../../../components/Tables/ClientTable";
import ClientForm from "./clientForm";
import { CreateBtn } from "../../../components";
import { useDispatch } from "react-redux";
import {
  fetchClientList,
  deleteClient,
} from "../../../redux/slices/clientSlice";
import { useRouter } from "next/router";
import PaginationDropdown from "../../../components/PaginationDropdown";
import styles from "./client-list.module.scss";
import { Button, Tag } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

interface Props {}

type IDProps = {
  id?: string;
  ids?: string;
};
const limit: number = 10;

const Users = ({}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [clients, setClients] = useState([]) as any;
  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [page, setPage] = useState(1) as any;

  const loading = useSelector(({ client }: RootStateOrAny) => client.loader);

  const clientData = useSelector(
    ({ client }: RootStateOrAny) => client.clientList
  );

  const totalClient = useSelector(
    ({ client }: RootStateOrAny) => client.totalClient
  );

  useEffect(() => {
    dispatch(fetchClientList({ page, limit }));
  }, []);

  useEffect(() => {
    setClients(clientData);
    if (clientData && clientData.length) {
      const length = totalClient + limit;
      const countArr = [];
      const firstCount = limit - 1;
      for (var i = limit; i < length; i = i + limit) {
        countArr.push([i - firstCount, i]);
      }
      setPaginationCount(countArr);
    }
  }, [clientData]);

  const onChangePagination = (e: any) => {
    dispatch(fetchClientList({ page: e, limit }));
    setPage(e);
  };

  const columns: any = [
    {
      title: "Client Code",
      dataIndex: "code",
      key: "code",
      className: "table-header-col",
      width: 150,
      sorter: (a: any, b: any) => a.code.localeCompare(b.code),
      showSorterTooltip: false,
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "Client Name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
      dataIndex: "name",
      key: "name",
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "Active",
      showSorterTooltip: false,
      dataIndex: "active",
      key: "active",
      width: 84,
      align: "center",
      render: (item: boolean) => {
        return <span className="text-left">{item ? "Yes" : "No"}</span>;
      },
    },
    // {
    //   title: () => (
    //     <span style={{color:theme?.lightGray}} className='text-xsm tracking-xl-wide'>Action</span>
    //   ),
    //   width: 200,
    //   align: 'center',
    //   dataIndex: '_id',
    //   key: '_id',
    //   render: (_id: string, record: any) => {
    //     return (
    //         <>
    //             <Tag
    //                 onClick={() => {setShow(true); setId(_id)}}
    //                 className={`${styles[`blueButton`]}`}
    //                 color={'blue'}
    //                 style={{ cursor: "pointer" }}
    //                 key={"Edit Role"}
    //             >
    //                 Edit Role
    //             </Tag>
    //                 <Tag
    //                     onClick={() => console.log(_id)}
    //                     className={`${styles[`redButton`]}`}
    //                     color={'red'}
    //                     style={{ cursor: "pointer" }}
    //                     key={"Delete Role"}
    //                 >
    //                     Delete Role
    //                 </Tag>
    //         </>
    //     )
    // },
    // className: "button-column",
    // },
  ];

  const handleScroll = (place: string) => {
    let table = document.querySelector("div.ant-table-body");
    if (!table) {
      return;
    }

    let scrollTop = table.scrollTop;

    if (place == "up") {
      table.scrollTop = scrollTop -= 20;
    } else if (place == "down") {
      table.scrollTop = scrollTop += 20;
    }
  };

  return (
    <UserDashboard>
      {/* <Button onClick={e => handleScroll('up')} className='ml-3'>
        Page Up
        <CaretUpOutlined style={{ fontSize: '18px', verticalAlign: 'top'}}/>
      </Button>
      <Button onClick={e => handleScroll('down')}>
        Page Down
        <CaretDownOutlined style={{ fontSize: '18px', verticalAlign: 'top'}}/>
      </Button> */}
      {!show ? (
        <>
          {/* <CreateBtn title="Create Client" onClick={() => setShow(true)} /> */}
          {/* <PaginationDropdown count={paginationCount} onPagination={(e) => onChangePagination(e)} /> */}
          <div className="z-0">
            <ClientTable
              rowSelection={false}
              columns={columns}
              dataSource={clients}
              loading={loading}
              pagination={false}
            />
          </div>
        </>
      ) : (
        <ClientForm onCancel={() => setShow(false)} _id={id} />
      )}
    </UserDashboard>
  );
};

export default Users;
