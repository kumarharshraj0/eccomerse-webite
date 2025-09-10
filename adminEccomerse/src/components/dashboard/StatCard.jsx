import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <div className="rounded-2xl shadow bg-white p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    </motion.div>
  );
}
