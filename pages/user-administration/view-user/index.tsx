import styles from "./viewUser.module.scss";
import { useRouter } from "next/router";
import { deleteUser, IUser } from "../../../redux/slices/usersSlice";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { PermissionsModalNew } from "../../../components/Modals";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EditUser from "../edit-user";
import { DeleteIconInModal } from "../../../components/Icons";
import AppModal from "../../../components/Modal";
import useTheme from "../../../hooks/useTheme";

interface Props {
  userId?: string;
  onCancel: () => void;
}

type IDProps = {
  id: string;
};

// @ts-ignore
const ViewUser = ({ userId, onCancel }: Props): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const usersData: IUser[] = useSelector(
    ({ users }: RootStateOrAny) => users.usersData
  );

  const [permissionsModalShow, setPermissionsModalShow] =
    useState<boolean>(false);
  const [selectedUserRoleId, setSelectedUserRoleId] = useState<string>("");
  const [showEdit, setShowEdit] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | undefined>();

  const [user, setUser] = useState<IUser>({
    _id: "",
    access_token: "",
    first_name: "",
    last_name: "",
    active: true,
    phone_number: "",
    username: "",
    power_bi_username: "Power Bi Username",
    domain_username: "Domain User",
    lock: true,
    password: "",
    client: "",
  });

  const onEdit = (id: any) => {
    // router.push({
    //   pathname: "/user-administration/edit-user",
    //   query: { uid: id },
    // });
    onCancel();
  };

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const getData = () => {
    if (usersData && usersData.length) {
      // const id = router.query.uid;
      const userObj = usersData.find((item) => item._id === userId) as any;
      setUser(userObj);
    }
  };

  const onDelete = async (id?: string) => {
    if (id) {
      const data = { id } as IDProps;
      await dispatch(deleteUser(data) as any);
      // router.push({
      //   pathname: "/user-administration/manage-users"
      // });
      onCancel();

      setShowDeleteModal(false);
    }
  };

  const onCancelDelete = (close: boolean) => {
    setShowDeleteModal(close);
    setUserToDeleteId("");
  };
  useEffect(() => {
    if (userToDeleteId?.trim()) {
      setShowDeleteModal(true);
      return;
    }
  }, [userToDeleteId]);

  return (
    <div>
      {!showEdit ? (
        <>
          <div className={styles.header}>
            <button
              onClick={onCancel}
              className={styles.backIcon}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                marginBottom: 12,
              }}
            >
              <ArrowLeftOutlined style={{ paddingRight: 12 }} />
              {"View User"}
            </button>
            <div>
              <button
                className={styles.deleteButton}
                onClick={() => setUserToDeleteId(user._id)}
              >
                Delete User
              </button>
              <button
                className={styles.editButton}
                onClick={() => setShowEdit(user._id)}
              >
                Edit User
              </button>
            </div>
          </div>
          <div className={styles.userInfoWrapper}>
            <div className={styles.userImageWrapper}>
              <Avatar
                shape="square"
                size={120}
                style={{
                  color: "#fff",
                  backgroundColor: theme?.primaryNight,
                  fontSize: "60px",
                }}
              >
                {user.username ? user.username.slice(0, 1).toUpperCase() : ""}
              </Avatar>
            </div>
            <div className={styles.userInfo}>
              <div>
                <span className={styles.company}>{user.client}</span>{" "}
              </div>
              <div>{user.username}</div>
              <div>{user.phone_number}</div>
              {/* <div className={styles.status}>{user.lock ? 'Yes' : 'No'}</div> */}
            </div>
          </div>
          <div className={styles.userInfoOtherWrapper}>
            {/* <div className={styles.heading}>Other Information</div> */}
            <div className={styles.otherInfo}>
              {/* <div>
            Username: <span>{user.full_name}</span>
          </div> */}
              <div>
                PowerBi Username: <span>{user.power_bi_username}</span>
              </div>
              <div>
                Domain Username: <span>{user.domain_username}</span>
              </div>
              <div>
                Status: <span>{user.lock ? "Yes" : "No"}</span>
              </div>
              {/*<div>*/}
              {/*  Print Type: <span>{user.print_client}</span>*/}
              {/*</div>*/}
              {/*<div>*/}
              {/*  Using New Print Client: <span>Yes</span>*/}
              {/*</div>*/}
              {/* <div>
                Role: <span>{user.role.role_name}</span>
              </div> */}
              <div>
                Client: <span>{user.client}</span>
              </div>
            </div>
          </div>
          {/* <div className={styles.userRolesWrapper}>
        <div className={styles.heading}>Other Information</div>
        <div className={styles.otherInfo}>
          <div className={styles.infoContent}>
            <span className={styles.infoHeading}>Roles ({user.role_name ? user.role_name.length : 0})</span>
            {user.role_name && user.role_name.map((item: any, i: number) => {
              return (
                <div key={i} className={styles.infoItem}>
                  {item.name}
                  <span
                    onClick={() => {
                      setSelectedUserRoleId(item._id);
                      setPermissionsModalShow(true);
                    }}
                    className={styles.roleBtn}>View Permission</span>
                </div>
              )
            })}
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoHeading}>Clients ({user.client ? user.client.length : 0})</span>
            {user.client && user.client.map((item: any, i: number) => {
              return (
                <div key={i} className={styles.infoItem}>{item}</div>
              )
            })}
          </div>
        </div>
      </div> */}
          {/* <PermissionsModal show={permissionsModalShow} onHide={() => setPermissionsModalShow(false)} userRoleId={selectedUserRoleId} /> */}
          <PermissionsModalNew
            show={permissionsModalShow}
            onHide={() => setPermissionsModalShow(false)}
            userRoleId={selectedUserRoleId}
          />
        </>
      ) : (
        <EditUser userId={showEdit} onCancel={() => setShowEdit("")} />
      )}
      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={onCancelDelete}
        icon={<DeleteIconInModal />}
        onPrimaryHandle={() => onDelete(userToDeleteId)}
      >
        <h1
          style={{
            color: theme?.monoLabel,
          }}
          className="text-center text-xmd"
        >
          Delete User
        </h1>
        <p
          style={{
            color: theme?.mono,
          }}
          className="mt-3 mb-3 text-center max-w-19 px-1 text-xsm leading-5"
        >
          Are you sure you want to delete this user?
        </p>
        {/* <div>
                  <label 
                  style={{
            color: theme?.monoLabel,
          }}
          htmlFor='reason' className='text-xsm mt-6'>
                    Reason
                  </label>
                  <TextArea
                    autoFocus={false}
                    defaultValue=''
                  style={{ backgroundColor: theme?.offWhite }}
                    className='border-1 border-primary-sea ring-transparent deleteTextArea mt-1 mb-8'
                    name='reason'
                    rows={2}
                    maxLength={250}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </div> */}
      </AppModal>
    </div>
  );
};

export default ViewUser;
