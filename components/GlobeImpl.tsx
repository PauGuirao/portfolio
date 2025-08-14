'use client';
import Globe, { type GlobeProps, type GlobeMethods } from 'react-globe.gl';

export default function GlobeImpl(
  props: GlobeProps & { forwardRef?: React.MutableRefObject<GlobeMethods | undefined> }
) {
  const { forwardRef, ...rest } = props;
  return <Globe ref={forwardRef} {...rest} />;
}
