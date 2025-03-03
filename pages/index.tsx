import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import FormContainer from '@/container/FormContainer'
import useSWR from 'swr'
import { useState, useRef } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getToken } from 'next-auth/jwt'
import { useSession, signOut } from 'next-auth/react'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const session = useSession()
  const popOverRef = useRef<HTMLButtonElement | null>(null)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showCreate, setShowCreate] = useState<boolean>(false)
  const [valueEdit, setShowValueEdit] = useState<{
    id: number
    title: string
    url: string
  }>({
    id: 0,
    title: '',
    url: '',
  })
  const { data: dataLinks, isLoading, mutate } = useSWR('/api/links', fetcher)

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/links/delete/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
    } finally {
      mutate()
      popOverRef.current?.click()
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="container">
          <h1 className="text-xl font-bold">{`Hello ${session.data?.user?.email}`}</h1>
          <p>This is an area to create your links , let's put here!!!</p>
          <Button variant={'link'} size={'sm'} onClick={() => signOut()}>
            SignOut
          </Button>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setShowCreate(true)}>Add Links</Button>
        </div>
        {isLoading && (
          <Card>
            <CardContent>Loadingss...</CardContent>
          </Card>
        )}
        {dataLinks?.data.map(
          (link: { id: number; url: string; title: string }) => (
            <Card key={link.id}>
              <CardContent className="flex justify-between">
                <a href={link.url} target="_blank">
                  {link.title}
                </a>
                <div>
                  <Button
                    size="sm"
                    variant={'secondary'}
                    onClick={() => {
                      setShowEdit(true)
                      setShowValueEdit({
                        id: link.id,
                        title: link.title,
                        url: link.url,
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button ref={popOverRef} variant="ghost" size="sm">
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-89">
                      <p>Are you sure for delete this data ?</p>
                      <Button size="sm" onClick={() => handleDelete(link.id)}>
                        Yes
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* Drawer Create */}
      <Drawer open={showCreate} onOpenChange={setShowCreate}>
        <DrawerContent>
          <div className="container ,x-auto p-4">
            <FormContainer
              id={valueEdit.id}
              onFinished={() => {
                setShowCreate(false)
                mutate()
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Drawer Edit */}
      <Drawer open={showEdit} onOpenChange={setShowEdit}>
        <DrawerContent>
          <div className="container ,x-auto p-4">
            <FormContainer
              id={valueEdit.id}
              values={{
                title: valueEdit.title,
                url: valueEdit.url,
              }}
              onFinished={() => {
                setShowEdit(false)
                mutate()
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const token = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return { props: {} }
}
