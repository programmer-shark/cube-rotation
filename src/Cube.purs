module Cube
  ( Action(..)
  , AngVelocity3D
  , Angle
  , Angle3D
  , Axis(..)
  , Distance
  , Edge
  , Point2D
  , Point3D
  , Query(..)
  , RotatingShape
  , Shape
  , State
  , accelerateBy
  , addCube
  , anglePerFrame
  , cubes
  , dampenAngVelocity
  , dampenPercent
  , decAngVelocity
  , frameRate
  , incAngVelocity
  , initCube
  , oneDegInRad
  , removeCube
  , renderView
  , reverse
  , rotate
  , rotateShape
  , tenDegInRad
  , velocityDecrement
  , velocityIncrement
  , viewBoxSize
  , viewCenter
  , updateCube
  )
  where

import Data.Tuple
import Prelude

import Control.Monad.ST (for)
import Control.Monad.State (state)
import Data.Array (last,snoc,drop,range, mapWithIndex, (!!))
import Data.Maybe (Maybe(..), fromMaybe)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Elements as HEL
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (a)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Math (cos, sin)
import Data.Foldable (for_)

-- Core Types
type Distance = Number

type Angle = Number

type Point2D =
  { x :: Distance
  , y :: Distance
  }

type Point3D =
  { x :: Distance
  , y :: Distance
  , z :: Distance
  }

type Edge = Tuple Int Int

type Shape =
  { vertices :: Array Point3D
  , edges :: Array Edge
  }

type Angle3D =
  { xa :: Angle
  , ya :: Angle
  , za :: Angle
  }

type AngVelocity3D = Angle3D -- velocity = angle/sec

type RotatingShape =
  { shape :: Shape
  , angVel :: AngVelocity3D
  , forward :: Boolean
  , velocity :: Number
  , count :: Number
  }

data Axis = X | Y | Z

-- Model / State
type State = Array RotatingShape

-- Values

viewBoxSize :: Number
viewBoxSize = 600.0

viewCenter :: Point2D
viewCenter =
  { x: viewBoxSize / 2.0
  , y: viewBoxSize / 2.0
  }

frameRate :: Number
frameRate = 200.0

oneDegInRad :: Angle
oneDegInRad = 0.01745329255

tenDegInRad :: Angle
tenDegInRad = oneDegInRad * 10.0

accelerateBy :: Number
accelerateBy = oneDegInRad * 50.0

dampenPercent :: Number
dampenPercent = 1.0 - (0.9 / frameRate) -- 10% per second

initCube :: RotatingShape
initCube =
  { shape:
      { vertices:
          [ { x:  100.0, y:  100.0, z:  100.0 }
          , { x: -100.0, y:  100.0, z:  100.0 }
          , { x:  100.0, y: -100.0, z:  100.0 }
          , { x: -100.0, y: -100.0, z:  100.0 }
          , { x:  100.0, y:  100.0, z: -100.0 }
          , { x: -100.0, y:  100.0, z: -100.0 }
          , { x:  100.0, y: -100.0, z: -100.0 }
          , { x: -100.0, y: -100.0, z: -100.0 }
          ]
      , edges:
          [ Tuple 0 1
          , Tuple 0 2
          , Tuple 0 4
          , Tuple 1 5
          , Tuple 1 3
          , Tuple 2 3
          , Tuple 2 6
          , Tuple 4 5
          , Tuple 4 6
          , Tuple 3 7
          , Tuple 6 7
          , Tuple 5 7
          ]
      }
  , angVel:
      { xa: tenDegInRad
      , ya: tenDegInRad
      , za: tenDegInRad
      }
  , forward: true
  , velocity: 1.0
  , count: 1.0
  }


data Query a = Tick a | Other a

-- Events
data Action
  = DecAngVelocity Axis
  | IncAngVelocity Axis
  | Reverse
  | VelocityIncrement
  | VelocityDecrement
  | AddCube
  | RemoveCube


cubes :: forall query input output m. H.Component Query input output m
cubes =
    H.mkComponent
        { initialState: const initialState
        , render
        , eval: H.mkEval $ H.defaultEval
              {
                handleAction = handleAction
              , handleQuery = handleQuery
              }
        }
    where
        initialState :: State
        initialState = [ initCube ]

        render :: forall m. State -> H.ComponentHTML Action () m
        render state = HH.div[][HH.ul[]$map renderView state]
        -- render = renderView

        handleAction :: forall output m. Action -> H.HalogenM  State Action () output m Unit
        handleAction query = case query of
            -- DecAngVelocity axis -> do
            --         cube <- H.get
            --         let {xa, ya, za} = cube.angVel
            --         let velocity = cube.velocity
            --         _ <- H.modify (\c ->
            --               case axis of
            --                 X -> c { angVel { xa = xa - accelerateBy  + velocity} }
            --                 Y -> c { angVel { ya = ya - accelerateBy  + velocity} }
            --                 Z -> c { angVel { za = za - accelerateBy  + velocity} }
            --             )
            --         pure unit
            -- IncAngVelocity axis -> do
            --         cube <- H.get
            --         let {xa, ya, za} = cube.angVel
            --         let velocity = cube.velocity
            --         let a = cube.forward
            --         _ <- H.modify (\c ->
            --                   case axis of
            --                     X -> c { angVel { xa = ( if a then xa + accelerateBy+velocity else xa - accelerateBy+velocity )} }
            --                     Y -> c { angVel { ya = ( if a then ya + accelerateBy+velocity else ya - accelerateBy+velocity)} }
            --                     Z -> c { angVel { za = ( if a then za + accelerateBy+velocity else za - accelerateBy+velocity) } }
            --           )
            --         pure unit
            -- Reverse  -> do
            --       cube <- H.get
            --       let a = cube.forward
            --       let vel = cube.velocity
            --       _ <- H.modify (\c ->
            --         c {forward = (if a then false else true)}
            --       )
            --       _ <- H.modify (\c ->
            --         c {velocity = -vel }
            --       )
            --       pure unit
            -- VelocityIncrement -> do
            --       cube <- H.get
            --       let vel = cube.velocity
            --       _ <- H.modify (\c ->
            --           c { velocity =  vel+ 30.0}
            --       )
            --       pure unit
            -- VelocityDecrement -> do
            --       cube <- H.get
            --       let vel = cube.velocity
            --       _ <- H.modify(\c ->
            --             c { velocity = vel - 30.0}
            --       )
            --       pure unit
            -- AddCube  -> do
            --       cube <- H.get
            --       -- let cou = cube.count
            --       -- _ <- H.modify(\c ->
            --       --       c { count = cou + 1.0 }
            --       --   )

            --       let newCube = initCube{count = cube.count+1.0}
            --       H.put newCube
            --       -- initialState = snoc [] newCube
            --       pure unit
            -- RemoveCube -> do
            --       cube <- H.get
            --       let cou = cube.count
            --       _ <- H.modify(\c ->
            --             c { count = cou - 1.0 }
            --         )
            --       pure unit

            DecAngVelocity axis -> do
                  _ <-  H.modify (\c -> map (decAngVelocity axis) c)
                  pure unit
            IncAngVelocity axis -> do
                    _ <- H.modify (\c -> map (incAngVelocity axis) c)
                    pure unit
            Reverse  -> do
                  _ <- H.modify (\c ->
                  map reverse c
                  )
                  pure unit
            VelocityIncrement -> do
                  _ <- H.modify (\c ->
                      map velocityIncrement c
                  )
                  pure unit
            VelocityDecrement -> do
                  _ <- H.modify(\c -> map velocityDecrement c
                  )
                  pure unit
            AddCube -> do
                  _ <- H.modify(\c -> addCube c initialState
                    )
                  pure unit
            RemoveCube -> do
                  _ <- H.modify(\c -> removeCube c initialState
                    )
                  pure unit


        handleQuery :: forall m a message. Query a -> H.HalogenM State Action () message m (Maybe a)
        handleQuery = case _ of
                Tick a -> do
                  _ <- H.modify(\c -> map updateCube c
                    )
                  pure (Just a)
                Other a ->
                  pure (Just a)

---- Unit Functions
updateCube ::RotatingShape -> RotatingShape
updateCube cube = cube
            {
              angVel = dampenAngVelocity cube.angVel
              ,shape =  newShape
            }
            where
              newShape = {
                          edges: cube.shape.edges
                        , vertices: rotateShape cube.shape.vertices (anglePerFrame cube.angVel)
              }

reverse ::RotatingShape -> RotatingShape
reverse cube = cube {forward = (if cube.forward then false else true)}

velocityDecrement :: RotatingShape -> RotatingShape
velocityDecrement cube = cube { velocity = cube.velocity - 30.0}

velocityIncrement :: RotatingShape -> RotatingShape
velocityIncrement cube = cube { velocity = cube.velocity + 30.0}

decAngVelocity :: Axis -> RotatingShape -> RotatingShape
decAngVelocity axis cube =
                              case axis of
                                X -> cube { angVel { xa = ( if cube.forward then cube.angVel.xa + accelerateBy+ cube.velocity else cube.angVel.xa - accelerateBy-cube.velocity )} }
                                Y -> cube { angVel { ya = ( if cube.forward then cube.angVel.ya + accelerateBy+cube.velocity else cube.angVel.ya - accelerateBy-cube.velocity)} }
                                Z -> cube { angVel { za = ( if cube.forward then cube.angVel.za + accelerateBy+cube.velocity else cube.angVel.za - accelerateBy-cube.velocity) } }

incAngVelocity :: Axis -> RotatingShape  -> RotatingShape
incAngVelocity axis cube =
                            case axis of
                                X -> cube { angVel { xa = ( if cube.forward then cube.angVel.xa + accelerateBy+cube.velocity else cube.angVel.xa - accelerateBy-cube.velocity )} }
                                Y -> cube { angVel { ya = ( if cube.forward then cube.angVel.ya + accelerateBy+cube.velocity else cube.angVel.ya - accelerateBy-cube.velocity)} }
                                Z -> cube { angVel { za = ( if cube.forward then cube.angVel.za + accelerateBy+cube.velocity else cube.angVel.za - accelerateBy-cube.velocity) } }
removeCube :: Array RotatingShape->State -> Array RotatingShape
removeCube cubes initialState= drop 1 cubes

addCube :: State ->State-> Array RotatingShape
addCube cubes initialState = snoc cubes initCube
  -- where
  --   cube = last cubes
  --   newCube = if cube == Nothing then initCube else initCube {count = cube.count+1.0}

---- End of Unit Functions
rotateShape :: Array Point3D -> AngVelocity3D -> Array Point3D
rotateShape vertices ang =
    map (rotate ang) vertices

rotate :: AngVelocity3D -> Point3D -> Point3D
rotate { xa, ya, za } = rotateX xa >>> rotateY ya >>> rotateZ za
  where
    rotateX ang {x,y,z} = let Tuple ny nz = rotateInPlane y z ang in { x, y:ny, z:nz }
    rotateY ang {x,y,z} = let Tuple nx nz = rotateInPlane x z ang in { x:nx, y, z:nz }
    rotateZ ang {x,y,z} = let Tuple nx ny = rotateInPlane x y ang in { x:nx, y:ny, z }

    rotateInPlane :: Number -> Number -> Number -> Tuple Number Number
    rotateInPlane axis1 axis2 ang =
      Tuple (axis1 * cos(ang) - axis2 * sin(ang)) (axis2 * cos(ang) + axis1 * sin(ang))

anglePerFrame :: AngVelocity3D -> Angle3D
anglePerFrame {xa, ya, za} =
  { xa: xa / frameRate
  , ya: ya / frameRate
  , za: za / frameRate
  }

dampenAngVelocity :: AngVelocity3D -> AngVelocity3D
dampenAngVelocity {xa, ya, za} =
    { xa: dampen xa
    , ya: dampen ya
    , za: dampen za
    }
  where
    dampen :: Number -> Number
    dampen ang = ang * dampenPercent -- Basics.max 0 (ang-drpf)


---------------------------------------------------------------------------------------

renderView :: forall m. RotatingShape -> H.ComponentHTML Action () m
renderView state = let
        {vertices, edges} = state.shape
        vert2Ds = map project vertices
    in
        HH.div [] $
        [ renderButton "rotX+" (IncAngVelocity X)
        , renderButton "rotY+" (IncAngVelocity Y)
        , renderButton "rotZ+" (IncAngVelocity Z)
        -- , renderButton "rotX--" (DecAngVelocity X)
        -- , renderButton "rotY--" (DecAngVelocity Y)
        -- , renderButton "rotZ--" (DecAngVelocity Z)
        , renderButton "reverse" (Reverse)
        , renderButton "vel++"  (VelocityIncrement)
        , renderButton "vel--"  (VelocityDecrement)
        , renderButton "Add Cube"  (AddCube)
        , renderButton "Remove Cube"  (RemoveCube)
        , HH.text ( show state.velocity )
        , HH.text ( show state.forward )
        , HH.text ( show state.count )

        ]
        <>
        [ SE.svg
            [ SA.viewBox 0.0 0.0 viewBoxSize viewBoxSize ]
            [ SE.g []
            (drawCube edges vert2Ds)
            ]
        ]
    where
        renderButton label query =
            HH.button
            [ HP.title label
            , HE.onClick (\_ -> query)
            ]
            [ HH.text label ]

        -- parallel projection
        project :: Point3D -> Point2D
        project p =
            { x: p.x + viewCenter.x
            , y: p.y + viewCenter.y
            }

        drawCube :: forall m. Array Edge -> Array Point2D -> Array (H.ComponentHTML Action () m)
        drawCube edges vert2Ds =
            drawEdges edges vert2Ds <> drawVertices vert2Ds

        drawEdges :: forall m. Array Edge -> Array Point2D -> Array (H.ComponentHTML Action () m)
        drawEdges edges verts = let
            connectedVerts = map (\(Tuple v1 v2) -> Tuple (verts !! v1) (verts !! v2)) edges
            in
            map (\(Tuple v1 v2) -> drawLine (getPoint v1) (getPoint v2)) connectedVerts

        getPoint :: Maybe Point2D -> Point2D
        getPoint maybePoint = let
            default = { x: 100.0, y: 100.0 }
            in
            fromMaybe default maybePoint

        drawVertices :: forall m. Array Point2D -> Array (H.ComponentHTML Action () m)
        drawVertices vert2Ds =
            mapWithIndex drawVertex vert2Ds


        drawLine :: forall m. Point2D -> Point2D -> H.ComponentHTML Action () m
        drawLine a b =
            SE.line
            [
              SA.x1 a.x
            , SA.x2 b.x
            , SA.y1 a.y
            , SA.y2 b.y
            , SA.stroke $ Just (SA.RGB 50 50 50)
            ]

        drawVertex :: forall m. Int -> Point2D -> H.ComponentHTML Action () m
        drawVertex idx {x, y} = SE.g []
            [ SE.text
                [ SA.x $ x + 5.0
                , SA.y $ y - 5.0
                , SA.fill $ Just (SA.RGB 150 150 150)
                ]
                [ HH.text $ show idx ]
            , SE.circle
                [ SA.r 3.0
                , SA.cx x
                , SA.cy y
                , SA.fill $ Just (SA.RGB 100 100 100)
                ]
            ]
