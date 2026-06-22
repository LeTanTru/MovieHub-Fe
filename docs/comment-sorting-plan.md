# Kế hoạch triển khai: Sắp xếp bình luận (Sort Comments)

Tài liệu này mô tả kế hoạch thiết kế và các bước kỹ thuật để tích hợp tính năng sắp xếp bình luận theo **Mới nhất (Newest)**, **Thích nhất (Top Liked)**, và **Bị ghét nhất (Top Disliked)** trong mục thảo luận của phim bằng cách tạo mới một component sắp xếp độc lập.

---

## 1. Mục tiêu & Yêu cầu

- Cho phép người dùng lựa chọn kiểu sắp xếp bình luận từ giao diện thảo luận.
- Hỗ trợ 3 tiêu chí sắp xếp:
  - **Mới nhất (Newest)**: Sắp xếp theo thời gian tạo giảm dần (Mặc định).
  - **Thích nhất (Top Liked)**: Sắp xếp theo số lượng like giảm dần.
  - **Bị ghét nhất (Top Disliked)**: Sắp xếp theo số lượng dislike giảm dần.
- Không sửa đổi component lọc tập phim hiện có là `CommentFilter` để giữ nguyên trách nhiệm đơn nhất (Single Responsibility). Thay vào đó, tạo mới component **`CommentSort`**.
- Phân bổ hiển thị trong [discussion.tsx](../src/components/app/discussion/discussion.tsx):
  - **Phim lẻ**: Chỉ hiển thị component `CommentSort`.
  - **Phim bộ**: Hiển thị song song cả `CommentFilter` (chọn tập) và `CommentSort` (chọn sắp xếp) nằm cạnh nhau.

---

## 2. Thay đổi về API Schema & Types

Cần cập nhật [comment.schema.ts](../src/schemaValidations/comment.schema.ts) để hỗ trợ các tham số lọc ở phía client-side validation khi gọi API lấy danh sách.

### Bước 2.1: Cập nhật `commentSearchSchema`

Thêm các thuộc tính kiểu boolean vào schema tìm kiếm:

```typescript
// D:\CODE\Web\KTLN\movie\fe\src\schemaValidations\comment.schema.ts
export const commentSearchSchema = z.object({
  authorId: z.string().optional().nullable(),
  id: z.string().optional().nullable(),
  isParent: z.string().optional().nullable(),
  isPinned: z.string().optional().nullable(),
  movieId: z.string().optional().nullable(),
  movieItemId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  // Thêm các cờ sắp xếp
  newest: z.boolean().optional().nullable(),
  topDisliked: z.boolean().optional().nullable(),
  topLiked: z.boolean().optional().nullable()
});
```

---

## 3. Tạo mới Component `CommentSort`

Chúng ta tạo một component độc lập tại đường dẫn `src/components/app/discussion/comment-sort.tsx`.

### Bước 3.1: Tạo file `comment-sort.tsx`

Component này sẽ sử dụng component `SelectField` có sẵn để hiển thị dropdown lựa chọn tiêu chí:

```typescript
import { useForm } from 'react-hook-form';
import { SelectField } from '@/components/form';
import { Form } from '@/components/ui/form';
import { useEffect } from 'react';

export type CommentSortType = 'newest' | 'topLiked' | 'topDisliked';

type CommentSortProps = {
  selectedSort: CommentSortType;
  onSortChange: (value: CommentSortType) => void;
};

type FormValues = {
  sortType: CommentSortType;
};

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'topLiked', label: 'Thích nhất' },
  { value: 'topDisliked', label: 'Bị ghét nhất' }
];

export function CommentSort({ selectedSort, onSortChange }: CommentSortProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      sortType: selectedSort
    }
  });

  const { control, setValue } = form;

  useEffect(() => {
    setValue('sortType', selectedSort);
  }, [selectedSort, setValue]);

  return (
    <Form {...form}>
      <SelectField
        control={control}
        name='sortType'
        options={sortOptions}
        onValueChange={(val) => {
          if (val) {
            onSortChange(val as CommentSortType);
          }
        }}
        className='max-640:w-36 max-480:w-28 h-8 w-40 rounded-md px-2! text-xs text-white'
        formItemClassName='text-xs'
        renderOption={(option) => (
          <span title={option.label} className='text-xs'>
            {option.label}
          </span>
        )}
      />
    </Form>
  );
}
```

---

## 4. Quản lý State & Query tại `Discussion`

Chúng ta cần cập nhật [discussion.tsx](../src/components/app/discussion/discussion.tsx) để tích hợp state sắp xếp mới và render song song hai bộ lọc.

### Bước 4.1: Thêm State Sắp xếp

```typescript
const [sortBy, setSortBy] = useState<CommentSortType>('newest');
```

### Bước 4.2: Ánh xạ State sang Params của Query

Chuyển đổi lựa chọn `sortBy` thành các cờ boolean tương ứng để truyền vào params của `useLoadMore`:

```typescript
const queryParams = useMemo(() => {
  return {
    movieId: id,
    movieItemId: selectedEpisodeId !== 'all' ? selectedEpisodeId : undefined,
    size: DEFAULT_PAGE_SIZE,
    newest: sortBy === 'newest' ? true : undefined,
    topLiked: sortBy === 'topLiked' ? true : undefined,
    topDisliked: sortBy === 'topDisliked' ? true : undefined
  };
}, [id, selectedEpisodeId, sortBy]);
```

### Bước 4.3: Render song song hai bộ lọc

Bố trí `CommentFilter` và `CommentSort` nằm kề nhau trong vùng chứa bộ lọc:

```tsx
<Activity visible={isCommentTab}>
  <div
    className={cn('my-2 flex items-center gap-2', {
      'my-4': isAuthenticated
    })}
  >
    <CommentFilter
      movie={movie}
      selectedEpisodeId={selectedEpisodeId}
      onValueChange={setSelectedEpisodeId}
    />
    <CommentSort selectedSort={sortBy} onSortChange={setSortBy} />
  </div>
  ...
</Activity>
```

---

## 5. Danh Sách Kiểm Tra & Kế Hoạch Kiểm Thử

1. [ ] Cập nhật schema tìm kiếm trong `comment.schema.ts`.
2. [ ] Tạo mới component `CommentSort` tại `src/components/app/discussion/comment-sort.tsx`.
3. [ ] Cập nhật state, logic query params và JSX tại `Discussion` component.
4. [ ] Kiểm thử tích hợp:
   - Chuyển đổi dropdown sắp xếp và đảm bảo API gọi lại với tham số tương ứng (`newest`, `topLiked`, `topDisliked`).
   - Đảm bảo đối với phim lẻ thì dropdown chọn tập phim ẩn đi nhưng dropdown sắp xếp vẫn hiển thị.
   - Đảm bảo tính năng Load More giữ nguyên tham số sắp xếp đang hoạt động.
