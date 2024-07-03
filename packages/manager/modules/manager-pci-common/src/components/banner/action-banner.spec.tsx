import { fireEvent, screen, render, act } from '@testing-library/react';
import { ActionBanner, ActionBannerProps } from './action-banner.component';

const renderComponent = (props: ActionBannerProps) =>
  render(<ActionBanner {...props} />);

describe('ActionBanner tests', () => {
  it('should display message', () => {
    renderComponent({
      message: 'hello world',
      cta: 'custom action',
      onClick: () => {},
    });

    expect(screen.getAllByText('hello world')).not.toBeNull();
  });

  it('should have a working call to action button', () => {
    const mockOnClick = jest.fn();

    renderComponent({
      message: 'hello world',
      cta: 'custom action',
      onClick: mockOnClick,
    });

    const actionBtn = screen.getByTestId('actionBanner-button');

    act(() => fireEvent.click(actionBtn));

    expect(mockOnClick).toHaveBeenCalled();
  });
});
