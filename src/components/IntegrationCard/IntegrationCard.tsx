import { type IntegrationListType } from "utils/integrations/types";

// import styles from "./IntegrationCard.module.scss";

interface IntegrationCardProps {
  integration: IntegrationListType;
}

const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  // const { name, logo, description, category } = integration;
  return <div>IntegrationCard</div>;
};

export default IntegrationCard;
