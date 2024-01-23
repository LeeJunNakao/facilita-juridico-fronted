import { Box, Grid } from "@mui/material";
import { range } from "components/utils/array";
import { Customer } from "protocols/entities";
import { PropsWithChildren, useEffect, useState } from "react";

type Coord = {
  x: number;
  y: number;
};

type Props = {
  customers: Customer[];
};

type LineProps = {
  direction: "horizontal" | "vertical";
  index: number;
  interval: number;
};

const Line = ({ direction, interval, index }: LineProps) => {
  const position = (index + 1) * interval;

  const props =
    direction === "horizontal"
      ? { width: "100%", top: position, borderBottom: "1px solid #e7e7e9" }
      : { height: "100%", left: position, borderLeft: "1px solid #e7e7e9" };

  return <Box position="absolute" boxSizing="border-box" {...props} />;
};

type PointProps = {
  coord: Coord;
  interval: number;
  origin?: boolean;
};

const Point = ({
  coord,
  interval,
  children,
  origin,
}: PropsWithChildren<PointProps>) => {
  const top = coord.y * interval;
  const left = coord.x * interval;

  const color = origin ? "blue" : "green";

  return (
    <Box
      position="absolute"
      boxSizing="border-box"
      width="10px"
      height="10px"
      sx={{
        backgroundColor: color,
        top: top - 5,
        left: left - 5,
        borderRadius: "50%",
        "& > .point-info": {
          display: "none",
        },

        "&:hover": {
          cursor: "pointer",
          border: "2px solid red",
          "& > .point-info": {
            display: "block",
          },
        },
      }}
    >
      <Box sx={{ width: "max-content", padding: 1 }} className="point-info">
        {children}
      </Box>
    </Box>
  );
};

const DIMENSION = 1000;

type PointInfoProps = {
  coord: Coord;
  name: string;
};

const PointInfo = ({ name, coord }: PointInfoProps) => {
  return (
    <Box sx={{ backgroundColor: "#ebebff", padding: 2 }}>
      <div>
        <span>
          ({coord.x},{coord.y})
        </span>
      </div>
      <div>{name}</div>
    </Box>
  );
};

const RoutePath = ({
  path,
  interval,
}: {
  path: [Coord, Coord];
  interval: number;
}) => {
  const [{ x: xStart, y: yStart }, { x: xEnd, y: yEnd }] = path;

  const distance = Math.sqrt(
    (xStart * interval - xEnd * interval) ** 2 +
      (yStart * interval - yEnd * interval) ** 2
  );
  const rad = Math.atan2(yStart - yEnd, xEnd - xStart) * -1;

  const deg = (rad * 180) / Math.PI;

  return (
    <Box
      sx={{
        position: "absolute",
        top: yStart * interval,
        left: xStart * interval,
        transform: `rotate(${deg}deg)`,
        width: `${distance}px`,
        borderBottom: "1px solid black",
        transformOrigin: "bottom left",
      }}
    ></Box>
  );
};

const RouteMap = ({ customers }: Props) => {
  const [boundaries, setBoundaries] = useState({
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  });

  const pointsQuantityX = boundaries.maxX - boundaries.minX;
  const pointsQuantityY = boundaries.maxY - boundaries.minY;
  const pointQuantity = Math.max(pointsQuantityX, pointsQuantityY) * 2;
  const scaleModificator = pointQuantity % 2 === 0 ? 3 : 4;
  const scale = pointQuantity + scaleModificator;
  const interval = DIMENSION / (scale + 1);

  const centerPoint = scale % 2 === 0 ? scale / 2 : Math.ceil(scale / 2);

  const foundMinX = customers.reduce(
    (min, curr) => Math.min(min, curr.address[0]),
    0
  );
  const foundMaxX = customers.reduce(
    (max, curr) => Math.max(max, curr.address[0]),
    0
  );
  const foundMinY = customers.reduce(
    (min, curr) => Math.min(min, curr.address[1]),
    0
  );
  const foundMaxY = customers.reduce(
    (max, curr) => Math.max(max, curr.address[1]),
    0
  );

  const customersWithBoardPosition = customers.map((c) => {
    const [x, y] = c.address;
    const parsedX = x + centerPoint;
    const parsedY = centerPoint - y;

    return {
      ...c,
      position: [parsedX, parsedY],
    };
  });

  const customersPath = [
    { position: [centerPoint, centerPoint] },
    ...customersWithBoardPosition,
  ].map((item, index, arr) => {
    const startCoord = { x: item.position[0], y: item.position[1] };
    const nextItem = arr[index + 1];

    const endCoord = nextItem
      ? { x: nextItem.position[0], y: nextItem.position[1] }
      : startCoord;

    return [startCoord, endCoord] as [Coord, Coord];
  });

  useEffect(() => {
    setBoundaries({
      minX: foundMinX,
      maxX: foundMaxX,
      minY: foundMinY,
      maxY: foundMaxY,
    });
  }, [customers]);

  return (
    <Box maxWidth="100%">
      <Box display="flex" justifyContent="center" overflow="auto">
        <Box
          position="relative"
          height={`${DIMENSION}px`}
          width={`${DIMENSION}px`}
          boxSizing="border-box"
          border={1}
        >
          <Box
            position="relative"
            height={`${DIMENSION}px`}
            width={`${DIMENSION}px`}
            boxSizing="border-box"
          >
            {range(scale).map((index) => (
              <Line direction="horizontal" index={index} interval={interval} />
            ))}
            {range(scale).map((index) => (
              <Line direction="vertical" index={index} interval={interval} />
            ))}
            <Point
              coord={{ x: centerPoint, y: centerPoint }}
              interval={interval}
              origin
            >
              <PointInfo coord={{ x: 0, y: 0 }} name="Origem" />
            </Point>
            {customersPath.map((path) => (
              <RoutePath path={path} interval={interval} />
            ))}
            {customersWithBoardPosition.map((item) => (
              <Point
                coord={{ x: item.position[0], y: item.position[1] }}
                interval={interval}
              >
                <PointInfo
                  coord={{ x: item.address[0], y: item.address[1] }}
                  name={item.name}
                />
              </Point>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RouteMap;
