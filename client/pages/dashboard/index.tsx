import type { GetServerSideProps, NextPage } from 'next'
const DashBoard: NextPage = () => {
  return (<>Dashboard</>);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
        }
    };
}

export default DashBoard
