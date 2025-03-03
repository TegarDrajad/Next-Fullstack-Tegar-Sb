import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { signIn, signOut, useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'

export default function Login() {
  const session = useSession()
  console.log('session', session)
  return (
    <>
      <div className="container mx-auto ">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please Login First</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button onClick={() => signIn('google')}>
                Signin With Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const token = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
