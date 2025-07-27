```tsx
  <InputField
              control={form.control}
              name='name'
              placeholder='OK'
              type='text'
              label='Name'
              required
              readOnly
            />
            <AutoCompleteField
              control={form.control}
              name='languages'
              options={tools}
              multiple
              label='Languages'
              placeholder='Select language'
              getLabel={(opt) => opt.name}
              getValue={(opt) => opt.id}
              getPrefix={(opt) => <opt.icon />}
              required
              allowClear
            />
            <AvatarField
              src='https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/517117458_766725599044404_9074829272074341154_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=aEQBwonBckUQ7kNvwG6y3Fb&_nc_oc=AdkJhoVPyhZCcFgIXlL9SVJhbEwzGUd_TtaweJUkgETh7QhKDJ6QmsdO8tDCF6WgjrSwqIv64iJHijVqmcWmS6nz&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=bgudVVL42USFZxK90zlkMQ&oh=00_AfQSYfdIJubcvX59HDlhRKREWwdK13CbU3TkzEQDameXzg&oe=687EF20D'
              size={80}
              zoomSize={256}
            />
            <DatePickerField
              control={form.control}
              name='date'
              label='Ngày phát hành'
              format='dd/MM/yyyy'
              description='Chọn thời gian đăng bài viết'
              placeholder='dd/MM/yyyy'
              required
              disabled
            />
            <TimePickerField
              control={form.control}
              name='startTime'
              label='Giờ bắt đầu'
              placeholder='HH:mm:ss'
              format='HH:mm:ss'
              required
              disabled
            />
            <Tooltip content='This is a tooltip'>
              <Button variant={'ghost'}>Hover me</Button>
            </Tooltip>
            <BooleanField
              control={form.control}
              name='boolean'
              label='OK bro?'
              required
            />
            <CheckboxField
              required
              control={form.control}
              name='check'
              label='OK'
              itemClassName='flex-row-reverse justify-end gap-2'
            />
            <CheckboxGroupField
              control={form.control}
              name='fruits'
              label='Select your favorite fruits'
              options={options}
              description='You can select multiple'
              required
            />
            <ColorPickerField
              control={form.control}
              name='color'
              label='Select color'
              required
            />
            <DateRangePickerField
              control={form.control}
              name='dateRange'
              label='Khoảng thời gian'
              description='Chọn thời gian diễn ra sự kiện'
              required
            />
            <DateTimePickerField
              control={form.control}
              name='publishAt'
              label='Ngày giờ phát hành'
              description='Chọn ngày giờ đăng bài viết'
              required
            />
            <UploadAvatarField
              control={form.control}
              name='avatar'
              label='Ảnh đại diện'
              required
            />
            <RadioGroupField
              control={form.control}
              name='gender'
              label='Gender'
              required
              options={[
                {
                  label: 'Male',
                  value: '0'
                },
                {
                  label: 'Female',
                  value: '1'
                }
              ]}
            />
            <TextAreaField
              control={form.control}
              name='text'
              label='Message'
              required
              className='focus'
              floatLabel
              maxLength={10}
              readOnly
            />
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Components', href: '/components' },
                { label: 'Breadcrumb' }
              ]}
            />
```
