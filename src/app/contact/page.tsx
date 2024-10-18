import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Contact() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="container mx-auto p-4 max-w-screen-sm">
        <Card className="">
          <CardHeader>
            <CardTitle>Contact Page</CardTitle>
          </CardHeader>
          <CardContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa animi hic molestiae!
            Alias, nostrum. Qui nobis numquam nam esse, corrupti, accusantium enim itaque deserunt
            distinctio aperiam, modi adipisci mollitia eligendi.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
