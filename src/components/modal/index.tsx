import React from 'react';

function Modalx({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div
          className="relative bg-white rounded-lg p-4 md:p-8"
          style={{
            maxWidth: '80vw', // réduit la largeur maximale
            maxHeight: '80vh', // réduit la hauteur maximale
            width: '80%', // ajuste la largeur à 80% de l'écran
            height: '70%', // ajuste la hauteur à 70% de l'écran
            overflowY: 'auto', // ajoute une barre de défilement si le contenu dépasse la hauteur
            margin: '0 auto', // centre le modèle horizontalement
          }}
        >
          <span className="absolute top-0 right-0 cursor-pointer text-xl p-2" onClick={onClose}>&times;</span>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modalx;