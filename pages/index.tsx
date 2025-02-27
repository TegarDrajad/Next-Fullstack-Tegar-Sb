import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import useSWR from'swr'

const formSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
})

const fetcher = ( ...args ) => fetch(...args).then((res) => res.json())

export default function Home() {

  const [loading, setLoading] = useState<boolean>(false)
  const {data: dataLinks, isLoading} = useSWR('/api/links', fetcher)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    console.log(values)
    try {
        await fetch('/api/links/create' , {
        method: 'POST',
        body: JSON.stringify(values)
      })
    } catch (error) {
      
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Form Create Link</CardTitle>
          <CardDescription>Submit your Linkl hire</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Url ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
        {
          isLoading && <Card>
              <CardContent>
                Loadingss...
              </CardContent>
            </Card>
        }
        {
          dataLinks?.data.map((link: {id:number, url:string, title:string}) => (
            <Card key={link.id}>
              <CardContent className="flex justify-between">
                <a href={link.url} target="_blank">
                  {link.title}
                </a>
                <Drawer>
                  <DrawerTrigger>Open</DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                      <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button>Submit</Button>
                      <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </CardContent>
            </Card>
          ))
        }
    </div>
    </>
  )
}
