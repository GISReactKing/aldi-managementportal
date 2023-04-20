import { default as React, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Collapse, Checkbox, Row, Col } from "antd";
import styles from "./permissionsModal.module.scss";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { fetchUserRoles } from "../../../redux/slices/newRolesAndPermissionSlice";

interface IPermissionsModal {
  show: boolean;
  onHide: () => void;
  userRoleId?: string;
}

const PermissionsModal = ({ show, onHide, userRoleId }: IPermissionsModal) => {
  // @ts-ignore
  const dispatch = useDispatch();
  const roles = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) => newRolesAndPermissions.roles
  );
  const [userRole, setUserRole] = useState<any>({});

  useEffect(() => {
    if (userRoleId) {
      dispatch(fetchUserRoles({ id: userRoleId }));
    }
  }, [userRoleId]);

  useEffect(() => {
    if (roles && userRoleId) {
      const selectedRole = roles.find((item: any) => item._id === userRoleId);
      setUserRole(selectedRole);
    }
  }, [roles, userRoleId]);

  const renderCollapseContent = (inputData: any) => {
    if (typeof inputData[Object.keys(inputData)[0]] === "boolean") {
      return (
        <div className={styles.collapseContent}>
          <Row>
            {[
              "Allow Create",
              "Allow Read",
              "Allow Update",
              "Allow Delete",
              "Allow Reports",
            ].map((name: any, indexVal: number) => {
              return (
                <Col key={indexVal}>
                  <Checkbox value={name} checked={inputData[name]}>
                    {name}
                  </Checkbox>
                </Col>
              );
            })}
          </Row>
        </div>
      );
    } else {
      return Object.keys(inputData).map((name: any, index: number) => {
        return (
          <Collapse
            key={index}
            defaultActiveKey={["1", "2", "3"]}
            className={styles.collapseContainer}
            bordered={false}
          >
            <Collapse.Panel
              header={name}
              key={index}
              className={styles.collapsePanel}
            >
              {renderCollapseContent(inputData[name])}
            </Collapse.Panel>
          </Collapse>
        );
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={styles.permissionsModalHeader}>
        <Modal.Title id="contained-modal-title-vcenter">
          Permissions
        </Modal.Title>
        <div className={styles.roleNameContainer}>
          <span className={styles.roleNameTitle}>Role Name: </span>
          <span className={styles.roleNameValue}>
            {userRole ? userRole.role_name : ""}
          </span>
        </div>
      </Modal.Header>
      <Modal.Body className={styles.permissionsModalBody}>
        <Collapse
          defaultActiveKey={["1", "2", "3"]}
          className={styles.collapseContainer}
          bordered={false}
        >
          {/* {renderCollapseContent(data)} */}
          {userRole?.permissions
            ? renderCollapseContent(userRole.permissions)
            : null}
        </Collapse>
      </Modal.Body>
    </Modal>
  );
};

export default PermissionsModal;
