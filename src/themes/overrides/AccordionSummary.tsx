// material-ui
// assets
import { RightOutlined } from "@ant-design/icons";
import { type Theme } from "@mui/material/styles";
import css from "styles/variables.module.scss";

// ==============================|| OVERRIDES - ALERT TITLE ||============================== //

export default function AccordionSummary(theme: Theme) {
  const { spacing } = theme;

  return {
    MuiAccordionSummary: {
      defaultProps: {
        expandIcon: <RightOutlined style={{ fontSize: "0.75rem" }} />,
      },
      styleOverrides: {
        root: {
          backgroundColor: css.grey925,
          flexDirection: "row-reverse",
          minHeight: 46,
          border: `1px solid ${css.grey925}`,
          borderRadius: `8px`,
        },
        expandIconWrapper: {
          "&.Mui-expanded": {
            transform: "rotate(90deg)",
          },
        },
        content: {
          marginTop: spacing(1.25),
          marginBottom: spacing(1.25),
          marginLeft: spacing(1),
        },
      },
    },
  };
}
