import './ProgressStepBarItem.css';

import React, { useRef } from 'react';

import { useFlag } from '../../../hooks/useFlag/useFlag';
import { IconProps } from '../../../icons/Icon/Icon';
import { cnMixFocus } from '../../../mixs/MixFocus/MixFocus';
import { cn } from '../../../utils/bem';
import { Direction } from '../../Popover/Popover';
import { ProgressSpin } from '../../ProgressSpin/ProgressSpin';
import { Text } from '../../Text/Text';
import { Tooltip } from '../../Tooltip/Tooltip';
import {
  PointNumbersMap,
  ProgressStepBarItemComponent,
  propPositionDefault,
  propStatusDefault,
} from '../helpers';

const cnProgressStepBarItem = cn('ProgressStepBarItem');

const possibleVerticalDirections: Direction[] = [
  'leftCenter',
  'rightCenter',
  'rightUp',
  'downCenter',
];
const possibleHorizontalDirections: Direction[] = [
  'downCenter',
  'upCenter',
  'downStartLeft',
  'downStartRight',
];

const renderPointContent = (
  point: PointNumbersMap | React.FC<IconProps> | undefined,
  size: 'm' | 's',
  progress: boolean | undefined,
) => {
  if (!point) return null;
  if (progress) return <ProgressSpin size={size} />;

  if (typeof point === 'function') {
    const Icon = point;

    return <Icon size="xs" />;
  }

  return (
    <Text
      className={cnProgressStepBarItem('PointText')}
      size={size === 's' ? '2xs' : 'xs'}
      weight="bold"
    >
      {point}
    </Text>
  );
};

export const ProgressStepBarItem: ProgressStepBarItemComponent = (props) => {
  const {
    content,
    tooltipContent,
    label,
    point,
    status,
    progress,
    direction,
    size,
    pointRef,
    onClick,
    position = propPositionDefault,
    ...otherProps
  } = props;

  const [isTooltipVisible, { on: setTooltipVisible, off: setTooltipUnVisible }] = useFlag();

  const anchorRef = useRef<HTMLDivElement>(null);

  const pointProps = {
    onMouseEnter: setTooltipVisible,
    onMouseLeave: setTooltipUnVisible,
    className: cnProgressStepBarItem(
      'Point',
      {
        size,
      },
      [cnMixFocus()],
    ),
    children: size !== 'xs' && renderPointContent(point, size, progress),
  };

  const pointButtonProps = {
    ref: pointRef as React.RefObject<HTMLButtonElement>,
    onClick,
  };

  const pointDivButton = {
    ref: pointRef as React.RefObject<HTMLDivElement>,
  };

  return (
    <>
      <div
        className={cnProgressStepBarItem({
          direction,
          position,
          status: status || propStatusDefault,
          size,
        })}
        {...otherProps}
      >
        {onClick ? (
          <button type="button" {...pointButtonProps} {...pointProps} />
        ) : (
          <div {...pointProps} {...pointDivButton} />
        )}
        <div className={cnProgressStepBarItem('Content', { bottomOffset: !!content })}>
          <Text
            className={cnProgressStepBarItem('Label')}
            ref={anchorRef}
            size={size}
            onMouseEnter={setTooltipVisible}
            onMouseLeave={setTooltipUnVisible}
            lineHeight={size === 's' ? 'xs' : size}
            view="primary"
          >
            {label}
          </Text>
          {content}
        </div>
      </div>
      {tooltipContent && isTooltipVisible && (
        <Tooltip
          anchorRef={anchorRef}
          className={cnProgressStepBarItem('Tooltip')}
          direction={direction === 'horizontal' ? 'downCenter' : 'leftUp'}
          possibleDirections={
            direction === 'horizontal' ? possibleHorizontalDirections : possibleVerticalDirections
          }
        >
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
};