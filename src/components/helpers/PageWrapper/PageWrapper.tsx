import PageLayout from "components/layouts/PageLayout";
import PrivateRoute from "components/PrivateRoute";
import Head from "next/head";

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
}

const PageWrapper = ({ children, title }: PageWrapperProps) => {
  return (
    <PrivateRoute>
      <Head>
        <title>{title}</title>
      </Head>
      <PageLayout>{children}</PageLayout>
    </PrivateRoute>
  );
};

export default PageWrapper;
