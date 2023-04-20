import { default as React, useEffect } from "react";
import { Modal, Row } from "react-bootstrap";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutCurrentUsers } from "../../../redux/slices/usersSlice";
import { removeNavTab } from "../../../redux/slices/navTabs";
import { getStateSliceResetter } from "../../../redux/slices/resetStates";
import {
  MultiBoxProductsRoutingPath,
  ProductFixedRoutingByRegionPath,
  ProductFixedRoutingDespatchPath,
  RolesAndPermissionsPath,
  CarrierCapacitySetUpPath,
  CarrierParcelLimitsPath,
  CarrierServicesActiveDatesPath,
  ClaimsPreparationPath,
  CarrierRoutingExceptionsHistoryPath,
  ItemFileStockReservationPath,
  ReturnsPortalPath,
  InvoiceReconciliationPath,
  ManageUsersPath,
} from "../../../constants/path-name";
import { AppButton } from "../../AppButton";

const PATHS = [
  MultiBoxProductsRoutingPath,
  ProductFixedRoutingByRegionPath,
  ProductFixedRoutingDespatchPath,
  RolesAndPermissionsPath,
  CarrierCapacitySetUpPath,
  CarrierParcelLimitsPath,
  CarrierServicesActiveDatesPath,
  ClaimsPreparationPath,
  CarrierRoutingExceptionsHistoryPath,
  ItemFileStockReservationPath,
  ReturnsPortalPath,
  InvoiceReconciliationPath,
  ManageUsersPath,
];
interface IWrongItemSentModal {
  show: boolean;
  onHide: () => void;
  text: string;
}

const Index = ({ show, onHide, text }: IWrongItemSentModal) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (event: any) => {
    onHide();
    dispatch(logoutCurrentUsers());
    dispatch(removeNavTab({ navTab: [] }));
    router.push("/");
    PATHS.forEach((link) => {
      let resetSlice = getStateSliceResetter(link);
      if (resetSlice) dispatch(resetSlice());
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className={styles.modalBody}>
        <p>{text}</p>
        <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
          <div className={styles.buttonsGroup}>
            <AppButton
              title="Cancel"
              className={styles.cancelButton}
              onClick={() => onHide()}
              type="outlined"
            />

            <AppButton
              className={styles.submitInactiveButton}
              onClick={handleSubmit}
              title="Log Out"
            />
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Index;
