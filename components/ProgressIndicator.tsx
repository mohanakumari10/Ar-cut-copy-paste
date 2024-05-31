// @refresh reset

import React, { useState, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const numX = 4;
const numY = 5;
const total = numX * numY;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function ProgressIndicator() {
  const init = Array(total)
    .fill(1)
    .map(() => ({
      r: new Animated.Value(1),
      a: new Animated.Value(1),
    }));
  const [anim] = useState(init);

  useEffect(() => {
    const animations = anim.map((value, index) => {
      const t = 400 + Math.random() * 300;

      const scaleAnimation = Animated.sequence([
        Animated.timing(value.r, { toValue: 3, duration: t - 50, useNativeDriver: true }),
        Animated.timing(value.r, { toValue: 1, duration: t, useNativeDriver: true }),
      ]);

      const opacityAnimation = Animated.sequence([
        Animated.timing(value.a, { toValue: 0.1, duration: t - 50, useNativeDriver: true }),
        Animated.timing(value.a, { toValue: 1, duration: t, useNativeDriver: true }),
      ]);

      return Animated.parallel([scaleAnimation, opacityAnimation]);
    });

    const loopedAnimations = Animated.stagger(50, animations.map((animation) => Animated.loop(animation)));

    loopedAnimations.start();
  }, [anim]);

  const circles = [];
  const margin = 100 / numX;
  for (let x = 0; x < numX; x++) {
    for (let y = 0; y < numY; y++) {
      const i = y * numX + x;
      circles.push({
        x: (x + 0.5) * margin,
        y: y * margin,
        r: anim[i].r,
        a: anim[i].a,
      });
    }
  }

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        {circles.map((c) => (
          <AnimatedCircle
            key={c.y * numX + c.x}
            cx={c.x}
            cy={c.y}
            r={c.r}
            fill="white"
            opacity={c.a}
          />
        ))}
      </Svg>
    </View>
  );
}
