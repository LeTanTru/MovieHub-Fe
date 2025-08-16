- **params**: là promise, khai báo params: Promise<{key: value}>

- **generateStaticParams**: dùng để tạo SSG với dynamic route

- **enable**: enable trong TanStack Query cho phép fetch trước hay không

- **middleware**: dùng NextRequest, NextResponse

- **Tự động nhận diện type**: const define = <T>: (route: T) => route

<Navigation
navListClassName='gap-2'
items={navigationList}
render={(item) => {
return item.submenu ? (
<>
<NavigationMenuTrigger className='text-muted-foreground hover:text-primary focus:text-primary group-[state=open]:text-primary cursor-pointer bg-transparent font-medium transition-all duration-200 ease-linear group-[state=open]:bg-transparent hover:bg-transparent! focus:bg-transparent data-[state=open]:bg-transparent *:[svg]:-me-0.5 *:[svg]:size-3.5'>
{item.label}
</NavigationMenuTrigger>
<NavigationMenuContent className='data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! bg-background/90! z-50 border-none! duration-200'>
<List
className={cn('grid', {
'w-48': item.subItems!.length <= 4,
'w-150 grid-cols-4': item.subItems!.length > 4
})} >
{item.subItems!.map((sub, index) => (
<ListItem key={index}>
<NavigationLink
                        href={sub.href!}
                        className='text-muted-foreground hover:text-primary cursor-pointer py-2.5! pl-4 whitespace-nowrap'
                      >

<div className='flex items-center gap-2'>
{sub.icon && <sub.icon className='size-4' />}
{<div className='font-medium'>{sub.label}</div>}
</div>
</NavigationLink>
</ListItem>
))}
</List>
</NavigationMenuContent>
</>
) : (
<NavigationLink
              href={item.href!}
              className='text-muted-foreground hover:text-primary py-1.5 font-medium whitespace-nowrap transition-all duration-200 ease-linear hover:bg-transparent'
            >
{item.label}
</NavigationLink>
);
}}
/>
