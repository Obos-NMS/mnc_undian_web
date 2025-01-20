import React, { useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import MyPagination from "../Pagination/MyPagination";
import { Menu } from "@mui/material";

const MyDataTable = ({
  children,
  renderCard,
  values = {},
  paginator = false,
  scrollable,
  scrollHeight = "100%",
  footerColumnGroup,
  headerColumnGroup,
  onChangePagination,
  selectionMode,
  onSelectionChange,
  onClick,
  onRowExpand,
  onRowCollapse,
  onRowToggle,
  rowExpansionTemplate,
  menu = [],
  rowsPerPageOptions,
  onChangePageSize,
  border,
}) => {
  const style = {
    "&.MuiPopover-root .MuiPaper-root": {
      boxShadow: "0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
      border: "1px solid #EAECF0",
      borderRadius: "8px",
      width: "max-content",
      ".MuiList-root.MuiList-padding": {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  };

  const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenuValue, setContextMenuValue] = useState(false);

  const handleContextMenu = (event, value) => {
    if ((values.data ?? []).some((e) => e.checked)) {
      event.preventDefault();
      setAnchorPosition({ top: event.clientY, left: event.clientX });
      setContextMenuValue(value);
      setIsOpen(true);
    }

  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setContextMenuValue(null);
    }, 200);
  };

  const onChange = (checked, value) => {
    let isCheckedAll = true;
    let updatedList = (values.data ?? []).map((item) => {
      if (item.id === value.id) {
        item.checked = checked;
      }

      if (!item.checked) {
        isCheckedAll = false;
      }

      return item;
    });

    onSelectionChange &&
      onSelectionChange({
        ...values,
        data: updatedList,
        checkedAll: isCheckedAll,
      });
  };

  const onChangeAll = (checked) => {
    let updatedList = (values.data ?? []).map((item) => {
      return { ...item, checked: checked };
    });

    onSelectionChange &&
      onSelectionChange({ ...values, data: updatedList, checkedAll: checked });
  };

  const onExpander = (value) => {
    value.expand = !(value.expand ?? false);
    if (value.expand) {
      onRowExpand && onRowExpand(value);
    } else {
      onRowCollapse && onRowCollapse(value);
    }

    let updatedList = (values.data ?? []).map((item) => {
      if (item.id === value.id) {
        item.expand = value.expand;
      }

      return item;
    });

    onRowToggle && onRowToggle({ ...values, data: updatedList });
  };

  return (
    <div className="h-full">
      <SimpleBar className="relative" style={{ maxWidth: "100%", height: scrollable ? scrollHeight : '100%' }}>
        <div className="flex flex-col gap-4 py-4 sm:hidden">
          {renderCard &&
            values &&
            (values?.data ?? []).map((value, i, arr) => {
              return renderCard(value, i)
            })}
        </div>
        <div className={renderCard && 'hidden sm:flex'}>
          <table className={`${scrollable ? 'border-separate border-spacing-0	' : 'border-collapse'} table w-full`}>
            <thead className={`${scrollable ? 'sticky top-0 z-[999]' : 'border-t'} border-gray-light/200 p-0`}>
              <tr className="bg-white hover:bg-gray-light/25" >
                {children &&
                  React.Children.map(children, (child, indexChild) => {
                    if (!child.props.isHideHeader) {
                      return React.cloneElement(child, {
                        tag: "th",
                        values: values,
                        selectionMode: selectionMode,
                        scrollable: scrollable,
                        onChangeAll: onChangeAll,
                        indexChild: indexChild,
                        key: indexChild,
                        border: border,
                      });
                    } else {
                      return <></>
                    }
                  })}
              </tr>
              {headerColumnGroup &&
                React.cloneElement(headerColumnGroup, { tag: "th", border: border })}
            </thead>
            <tbody>
              {children &&
                values &&
                (values?.data ?? []).map((value, indexValue, arr) => (
                  <React.Fragment key={indexValue}>
                    <tr className="hover:bg-gray-light/25"
                      onContextMenu={(e) => handleContextMenu(e, value)}
                      onClick={(e) => {
                        if (e.target.closest(".input-checkbox")) {
                          return;
                        }

                        onClick && onClick(value)
                      }}
                    >
                      {React.Children.map(children, (child, indexChild) => {
                        return React.cloneElement(child, {
                          tag: "td",
                          values: values,
                          value: value,
                          selectionMode: selectionMode,
                          onChange: onChange,
                          onExpander: onExpander,
                          indexValue: indexValue,
                          indexChild: indexChild,
                          key: indexValue,
                          border: border,
                        });
                      })}
                    </tr>
                    {(value.expand && rowExpansionTemplate) && <tr >
                      <td colSpan={children.length}>
                        {rowExpansionTemplate(value, indexValue)}
                      </td>
                    </tr>}
                  </React.Fragment>
                ))}
              {footerColumnGroup &&
                React.cloneElement(footerColumnGroup, { tag: "td", border: border })}
            </tbody>
          </table>
        </div>
      </SimpleBar>
      {menu && menu.length !== 0 && (
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition}
          sx={style}
          open={isOpen}
          onClose={handleClose}
        >
          <div className="w-max h-max flex flex-col gap-1 py-1">
            {menu.map((e, i) => (
              <>
                {e.content && e.content(contextMenuValue, handleClose)}
                {i != menu.length - 1 && <hr className="border-gray-light/200" />}
              </>
            ))}
          </div>
        </Menu>
      )}

      {paginator &&
        <MyPagination meta={values?.meta} onChange={onChangePagination}
          rowsPerPageOptions={rowsPerPageOptions} onChangePageSize={onChangePageSize} />
      }
    </div>
  );
};

export default MyDataTable;
