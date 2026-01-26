import clsx from 'clsx';

/**
 * Card Component
 * Boxed design inspired by Kenchic's professional layout
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effect
 * @param {boolean} props.bordered - Add border accent
 * @param {string} props.borderColor - Border color class
 */
const Card = ({
  children,
  className = '',
  hover = false,
  bordered = false,
  borderColor = 'border-primary-500',
  ...props
}) => {
  return (
    <div
      className={clsx(
        'content-box',
        hover && 'cursor-pointer hover:shadow-card-hover',
        bordered && `border-t-4 ${borderColor}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
