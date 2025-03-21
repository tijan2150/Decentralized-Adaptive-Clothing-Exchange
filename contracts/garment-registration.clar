;; Garment Registration Contract
;; Records details of specialized clothing items

(define-data-var last-garment-id uint u0)

(define-map garments
  { garment-id: uint }
  {
    owner: principal,
    name: (string-utf8 100),
    description: (string-utf8 500),
    size: (string-utf8 20),
    adaptations: (string-utf8 500),
    available: bool,
    created-at: uint
  }
)

(define-public (register-garment
    (name (string-utf8 100))
    (description (string-utf8 500))
    (size (string-utf8 20))
    (adaptations (string-utf8 500))
  )
  (let
    (
      (new-id (+ (var-get last-garment-id) u1))
      (caller tx-sender)
    )
    (var-set last-garment-id new-id)
    (map-set garments
      { garment-id: new-id }
      {
        owner: caller,
        name: name,
        description: description,
        size: size,
        adaptations: adaptations,
        available: true,
        created-at: block-height
      }
    )
    (ok new-id)
  )
)

(define-public (update-availability (garment-id uint) (is-available bool))
  (let
    ((garment (unwrap! (map-get? garments { garment-id: garment-id }) (err u404)))
     (caller tx-sender))

    ;; Check if caller is the owner
    (asserts! (is-eq caller (get owner garment)) (err u403))

    ;; Update availability
    (map-set garments
      { garment-id: garment-id }
      (merge garment { available: is-available })
    )
    (ok true)
  )
)

(define-read-only (get-garment (garment-id uint))
  (map-get? garments { garment-id: garment-id })
)

(define-read-only (get-last-garment-id)
  (var-get last-garment-id)
)
