import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import _ from "lodash";
import { removeNavTab } from "../../redux/slices/navTabs";
import Tabs from "../UserDashboard/tabs";
import { getStateSliceResetter } from "../../redux/slices/resetStates";
import useTheme from "../../hooks/useTheme";

const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 1;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 4,
  margin: `0 ${grid}px 0 0`,
  background: isDragging ? "#fff" : "#fff",
  boxShadow: isDragging ? "0px 4px 8px rgba(10, 10, 40, 0.07)" : "none",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean, borderColor?: string) => ({
  background: isDraggingOver ? "" : "",
  display: "flex",
  padding: grid,
  overflow: "auto",
  ...(borderColor ? { borderColor: borderColor } : {}),
});

interface props {}

const DragSystem = ({}: props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();

  const navTabs: any = useSelector(
    ({ navTabs }: RootStateOrAny) => navTabs.navTabs
  );

  const onDragEnd = (result: any) => {
    console.log("result-", result);
    if (!result.destination) {
      return;
    }
    const data = reorder(
      navTabs,
      result.source.index,
      result.destination.index
    );
    dispatch(removeNavTab({ navTab: data }));
  };

  const removeTab = (link: any) => {
    const resetSlice = getStateSliceResetter(link);
    const updatedTabs = _.filter(navTabs, (o: any) => o.link !== link);
    const updatedTabsIndex = _.findIndex(navTabs, (o: any) => o.link === link);
    dispatch(removeNavTab({ navTab: updatedTabs }));
    if (resetSlice) dispatch(resetSlice());
    const linkMover =
      navTabs[updatedTabsIndex + 1]?.link ||
      navTabs[updatedTabsIndex - 1]?.link;
    linkMover ? router.replace(linkMover) : router.replace("/home");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided: any, snapshot: any) => (
          <div
            className={`${navTabs.length > 0 ? "border-t border-b" : ""}`}
            ref={provided.innerRef}
            style={
              navTabs.length > 0
                ? getListStyle(snapshot.isDraggingOver, theme?.monoBorder)
                : getListStyle(snapshot.isDraggingOver)
            }
            {...provided.droppableProps}
          >
            {navTabs.map((item: any, index: number) => (
              <Draggable key={item.link} draggableId={item.link} index={index}>
                {(provided: any, snapshot: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <Tabs
                      onRemove={() => removeTab(item.link)}
                      tabData={item}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// Put the thing into the DOM!
export default DragSystem;
