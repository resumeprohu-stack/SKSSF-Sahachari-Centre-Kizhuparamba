import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[calc(100vh-4rem)] text-white">
        <Image
          src="/600.jpg"
          alt="Community and unity"
          fill
          className="object-contain"
          data-ai-hint="community help"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <Link href="https://www.facebook.com/profile.php?id=100073117396245" target="_blank" aria-label="Facebook Page" className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            <Image src="/fb.png" alt="Facebook Page" width={20} height={20} />
          </Link>
          <Link href="https://www.facebook.com/profile.php?id=100073117396245" target="_blank" aria-label="Facebook Page" className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            <Image src="/fb.png" alt="Facebook Page" width={20} height={20} />
          </Link>
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">
            SKSSF
          </h1>
          <h2 className="text-3xl md:text-[2.8rem] font-bold font-headline tracking-tight uppercase">
            Sahachari Centre Kizhuparamba
          </h2>
          <div className="mt-4 text-lg md:text-2xl">
            <p>കരുണയുടെ നോട്ടം</p>
            <p>കനിവിൻ്റെ സന്ദേശം</p>
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link href="/items">ലഭ്യമായ ഉപകരണങ്ങൾ കാണുക</Link>
          </Button>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                About Sahachari Center
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The SKSSF Sahachari Center in Kizhuparamba is a charity organization dedicated to providing essential resources to those in need within our community. We manage and lend items to ensure everyone has access to the support they require.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Our mission is to foster a spirit of sharing and support, making our community stronger and more resilient. This platform helps us transparently manage our resources and connect them with the people who need them most.
              </p>
            </div>
            <div>
                <Image
                  src="https://picsum.photos/seed/community/600/400"
                  alt="Community volunteers"
                  data-ai-hint="community volunteers"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg object-cover w-full h-full"
                />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
