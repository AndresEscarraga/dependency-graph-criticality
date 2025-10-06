import { describe, it, expect } from 'vitest';
import { Panel } from './panel';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom/vitest';

describe('Panel', () => {
  it('renders title and description', () => {
    const { getByText } = render(<Panel title="Test" description="Info">Content</Panel>);
    expect(getByText('Test')).toBeInTheDocument();
    expect(getByText('Info')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
  });
});
