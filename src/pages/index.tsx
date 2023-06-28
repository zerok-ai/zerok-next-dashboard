import { ReactElement } from 'react';

// project import
import Layout from 'layout';

export default function HomePage() {
  return (
    <Page title="Landing">
    </Page>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="landing">{page}</Layout>;
};
