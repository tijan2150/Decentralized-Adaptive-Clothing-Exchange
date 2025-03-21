;; Design Sharing Contract
;; Facilitates exchange of successful clothing patterns

(define-data-var last-design-id uint u0)

(define-map designs
  { design-id: uint }
  {
    creator: principal,
    name: (string-utf8 100),
    description: (string-utf8 500),
    disability-focus: (string-utf8 200),
    pattern-uri: (string-utf8 256),
    license: (string-utf8 100),
    created-at: uint
  }
)

(define-map design-ratings
  { design-id: uint, rater: principal }
  { rating: uint, comment: (string-utf8 500) }
)

(define-public (share-design
    (name (string-utf8 100))
    (description (string-utf8 500))
    (disability-focus (string-utf8 200))
    (pattern-uri (string-utf8 256))
    (license (string-utf8 100))
  )
  (let
    (
      (new-id (+ (var-get last-design-id) u1))
      (caller tx-sender)
    )
    (var-set last-design-id new-id)
    (map-set designs
      { design-id: new-id }
      {
        creator: caller,
        name: name,
        description: description,
        disability-focus: disability-focus,
        pattern-uri: pattern-uri,
        license: license,
        created-at: block-height
      }
    )
    (ok new-id)
  )
)

(define-public (rate-design (design-id uint) (rating uint) (comment (string-utf8 500)))
  (let
    (
      (caller tx-sender)
      (design (unwrap! (map-get? designs { design-id: design-id }) (err u404)))
    )
    ;; Check if rating is between 1 and 5
    (asserts! (and (>= rating u1) (<= rating u5)) (err u400))

    ;; Check if caller is not the creator (can't rate own design)
    (asserts! (not (is-eq caller (get creator design))) (err u403))

    (map-set design-ratings
      { design-id: design-id, rater: caller }
      { rating: rating, comment: comment }
    )
    (ok true)
  )
)

(define-read-only (get-design (design-id uint))
  (map-get? designs { design-id: design-id })
)

(define-read-only (get-design-rating (design-id uint) (rater principal))
  (map-get? design-ratings { design-id: design-id, rater: rater })
)
