export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/upload',
            permanent: true
        }
    }
}

export default function HomeRedirect() {
    return null
}
