/** @format */
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styles from "./client-list.module.scss";
import stylesCreate from "../set-up-user/create.module.scss";
import { Col, Form as FormBootstrap, Row } from "react-bootstrap";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { createClient, updateClient } from "../../../redux/slices/clientSlice";
import { Checkbox } from "antd";

interface Props {
  onCancel: () => void;
  _id?: string;
  setUser?: any;
  user?: any;
}

const ClientList = ({ onCancel, _id, user, setUser }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isEditPage, setIsEditPage] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const clientData = useSelector(
    ({ client }: RootStateOrAny) => client.clientList
  );

  useEffect(() => {
    if (_id) {
      setIsEditPage(true);
      getData();
    }
  }, [_id]);

  const getData = () => {
    if (clientData && clientData.length) {
      const id = _id;
      const clientDataObj = clientData.find(
        (item: any) => item._id === id
      ) as any;
      if (clientDataObj) {
        setName(clientDataObj.name);
        setCode(clientDataObj.code);
        setCode(clientDataObj.active);
      }
    }
  };

  const onSubmit = async () => {
    if (!name || !code) {
      return;
    }
    const data = {
      name,
      code,
      active,
      creator: currentUser ? currentUser._id : "6199ff3ba19f334325693568",
    };

    if (isEditPage) {
      dispatch(
        updateClient({
          ...data,
          id: _id,
        })
      );
      onCancel();
    } else {
      if (user && setUser) {
        setUser({
          ...user,
          client: data.name,
        });
      }

      dispatch(createClient(data));
      onCancel();
    }
  };

  return (
    <div className={stylesCreate.wrapper}>
      <div className={stylesCreate.newRolePermissionContainer}>
        <button
          onClick={onCancel}
          className={stylesCreate.cancelButton}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            marginBottom: 12,
          }}
        >
          <ArrowLeftOutlined style={{ paddingRight: 12 }} />
          {isEditPage ? "Edit Client" : "Create Client"}
        </button>
        <Row className={`${styles.fieldsRow} ${styles.roleFormRow}`}>
          <Col md={3} className={styles.col1}>
            <FormBootstrap.Group as={Col} controlId="code">
              <FormBootstrap.Label>Client Code</FormBootstrap.Label>
              <FormBootstrap.Control
                className={styles.formItem1}
                name="code"
                value={code}
                onChange={({ target }) => {
                  setCode(target.value);
                }}
                required
              />
              <FormBootstrap.Control.Feedback type="invalid">
                Please enter a client code.
              </FormBootstrap.Control.Feedback>
            </FormBootstrap.Group>
          </Col>
          <Col md={4}>
            <FormBootstrap.Group as={Col} controlId="name">
              <FormBootstrap.Label>Client Name</FormBootstrap.Label>
              <FormBootstrap.Control
                className={styles.formItem2}
                name="name"
                value={name}
                onChange={({ target }) => {
                  setName(target.value);
                }}
                required
              />
              <FormBootstrap.Control.Feedback type="invalid">
                Please enter a role name.
              </FormBootstrap.Control.Feedback>
            </FormBootstrap.Group>
          </Col>
          <Col md={3}>
            <FormBootstrap.Group as={Col} controlId="active" className="mt-9">
              <Checkbox
                name="active"
                checked={active}
                onChange={(target: any) => setActive(target.checked)}
              >
                User Active
              </Checkbox>
            </FormBootstrap.Group>
          </Col>
        </Row>
        <div className={stylesCreate.buttonsGroup}>
          <button className={stylesCreate.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={
              code && name
                ? stylesCreate.nextButton
                : stylesCreate.nextButtonDisabled
            }
            onClick={onSubmit}
          >
            {isEditPage ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
