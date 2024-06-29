import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from "react-native";
import SliderBar from "./SliderBar";
import SliderCircle from "./SliderCircle";

export default function Slider2({
  minValue,
  maxValue,
  increment,
  setValues,
  sliderCount,
}: {
  minValue: number;
  maxValue: number;
  increment: 1 | 5 | 10 | 20;
  setValues: Function;
  sliderCount: 1 | 2;
}) {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(250);
  const [cleanLeft, setCleanLeft] = useState(0);
  const [cleanRight, setCleanRight] = useState(250);

  const pan = useMemo(() => new Animated.Value(cleanLeft), [cleanLeft]);

  const barPadding = (Dimensions.get("screen").width - 250) / 2;
  const roundToHundredths = (value: number) => {
    return Math.round(value * 100) / 100;
  };
  const incrementSize = roundToHundredths(
    (increment / (maxValue - minValue)) * 250
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        pan.setOffset(gestureState.x0 - barPadding);
      },
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        pan.extractOffset();
      },
    })
  ).current;

  let pan_2: Animated.Value;
  let secondSlider = null;

  if (sliderCount == 2) {
    pan_2 = useMemo(() => new Animated.Value(cleanRight), [cleanRight]);

    const panResponder_2 = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e, gestureState) => {
          pan_2.setOffset(gestureState.x0 - (250 + barPadding));
        },
        onPanResponderMove: Animated.event([null, { dx: pan_2 }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gestureState) => {
          pan_2.extractOffset();
        },
      })
    ).current;

    secondSlider = (
      <SliderCircle
        translation={cleanRight}
        panHandlers={panResponder_2.panHandlers}
      />
    );
  }

  const snapToIncrement = (value: number) => {
    console.log(value);
    console.log(value % incrementSize);
    console.log(incrementSize * 0.6);
    if (value % incrementSize <= incrementSize * 0.4) {
      return Math.floor(value / incrementSize) * incrementSize;
    }
    if (value % incrementSize >= incrementSize * 0.6) {
      return Math.ceil(value / incrementSize) * incrementSize;
    }
  };
  const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(min, val), max);
  };

  useEffect(() => {
    pan.addListener(({ value }) => {
      const newValue = snapToIncrement(value);
      if (newValue) setLeft(newValue);
    });

    if (pan_2) {
      pan_2.addListener(({ value }) => {
        const newValue = snapToIncrement(250 + value);
        if (newValue) setRight(newValue);
      });
    }

    return () => {
      pan.removeAllListeners();
      if (pan_2) {
        pan_2.removeAllListeners();
      }
    };
  }, []);

  const calculateValue = (value: number) => {
    const denominator = maxValue - minValue;

    // x/denominator = value/250 <---- solve for x
    let x = denominator * roundToHundredths(value / 250);
    return minValue + Math.round(x);
  };

  useEffect(() => {
    let newValue = clamp(right, cleanLeft + incrementSize, 250);
    setCleanRight(newValue);
    setValues(calculateValue(newValue), 1);
  }, [right]);

  useEffect(() => {
    let newValue = clamp(left, 0, cleanRight - incrementSize);
    setCleanLeft(newValue);
    setValues(calculateValue(newValue), 0);
  }, [left]);

  return (
    <View style={styles.sliderBar}>
      <View style={styles.inactiveBar}></View>
      <SliderBar start={cleanLeft} length={cleanRight - cleanLeft} />
      <SliderCircle
        translation={cleanLeft}
        panHandlers={panResponder.panHandlers}
      />
      {secondSlider}
      <Text>{cleanLeft}</Text>
      <Text>{incrementSize}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderBar: {
    position: "relative",
  },
  inactiveBar: {
    height: 2,
    backgroundColor: "lightblue",
    width: 250,
  },
});
