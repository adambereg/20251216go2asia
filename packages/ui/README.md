# @go2asia/ui

UI Design System for Go2Asia MVP.

## Usage

```tsx
import { Button, Card, Badge, Input } from '@go2asia/ui';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary" size="lg">
        Click me
      </Button>
      <Badge type="pro" />
      <Input label="Email" placeholder="Enter your email" />
    </Card>
  );
}
```

## Components

### Button
- Variants: `primary`, `secondary`, `ghost`
- Sizes: `sm`, `md`, `lg`, `xl`
- Supports icons (left/right)

### Card
- Hover effects (optional)
- Responsive padding

### Badge
- Types: `lock`, `pro`, `rf`, `rf-full`

### Input
- Label support
- Error messages
- Focus states





